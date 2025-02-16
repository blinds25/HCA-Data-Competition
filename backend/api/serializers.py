from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Person
        fields = ['id', 'first_name', 'last_name', 'location', 'city', 'state', 'department', 'position', 'zip_code', 'latitude', 'longitude']
