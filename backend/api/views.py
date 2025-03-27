# backend/api/views.py

import math
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Person
from .serializers import PersonSerializer
from django.core.mail import send_mail
from django.conf import settings

def haversine(lat1, lon1, lat2, lon2):
    """
    Calculate the great-circle distance between two points on the Earth (in miles).
    """
    R = 3958.8  # Earth radius in miles
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@api_view(['GET'])
def get_data(request):
    nationwide = request.query_params.get('nationwide')
    states = request.query_params.getlist('states')
    
    # For nationwide query mode
    if nationwide:
        # Get all persons, potentially filtered by state(s)
        if states:
            persons = Person.objects.filter(state__in=states)
        else:
            persons = Person.objects.all()
            
        # Separate into "local" (first 100) and "nearby" (rest) for compatibility with frontend
        # This separation is arbitrary since we're showing all data
        serializer = PersonSerializer(persons, many=True)
        all_data = serializer.data
        
        # Arbitrary split to maintain API structure expected by frontend
        return Response({
            "local": all_data[:100],  # First 100 for convenience
            "nearby": all_data[100:]  # The rest
        })
    
    # Original location-based query mode with zip code and radius
    zip_code = request.query_params.get('zip_code')
    try:
        radius = float(request.query_params.get('radius', 50))
    except (TypeError, ValueError):
        radius = 50  # default radius if none provided or invalid

    if not zip_code or len(zip_code) != 5:
        return Response({"error": "Invalid zip code"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get local people (matching zip code)
    local_qs = Person.objects.filter(zip_code=zip_code)
    
    # Determine center coordinates (use first local record if available)
    if local_qs.exists():
        try:
            center_lat = float(local_qs.first().latitude)
            center_lon = float(local_qs.first().longitude)
        except (TypeError, ValueError):
            center_lat, center_lon = 37.773972, -122.431297
    else:
        center_lat, center_lon = 37.773972, -122.431297

    # Compute nearby people: those not in the local zip code, within the radius,
    # and where is_medical is "Medical".
    nearby_list = []
    # Filter others for is_medical == "Medical"
    others = Person.objects.exclude(zip_code=zip_code).filter(is_medical="Medical")
    for person in others:
        try:
            person_lat = float(person.latitude)
            person_lon = float(person.longitude)
        except (TypeError, ValueError):
            continue
        distance = haversine(center_lat, center_lon, person_lat, person_lon)
        if distance <= radius:  # within the selected radius
            nearby_list.append(person)

    local_serializer = PersonSerializer(local_qs, many=True)
    nearby_serializer = PersonSerializer(nearby_list, many=True)
    
    return Response({
        "local": local_serializer.data,
        "nearby": nearby_serializer.data
    })

@api_view(['POST'])
def send_email_view(request):
    subject   = request.data.get('subject')
    message   = request.data.get('message')
    recipient = request.data.get('recipient')
    
    if not subject or not message or not recipient:
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
    
    from_email = settings.EMAIL_HOST_USER
    try:
        send_mail(subject, message, from_email, [recipient])
        return Response({"success": "Email sent successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
