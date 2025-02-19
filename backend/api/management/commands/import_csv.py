# api/management/commands/import_csv.py
import csv
from django.core.management.base import BaseCommand
from api.models import Person  # Adjust the import based on your app structure

class Command(BaseCommand):
    help = 'Imports data from a CSV file into the Person model.'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The path to the CSV file.')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']

        with open(csv_file, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                Person.objects.create(
                    first_name=row.get('EmpFirstName'),
                    last_name=row.get('EmpLastName'),
                    location=row.get('EmpLocationDesc'),
                    city=row.get('facility_city'),
                    state=row.get('facility_state'),
                    department=row.get('EmpDepartmentName'),
                    position=row.get('EmpPositionDesc'),
                    zip_code=row.get('facility_zip'),
                    latitude=row.get('latitude') or None,
                    longitude=row.get('longitude') or None,
                    is_medical=row.get('PositionCategory'),
                    email=row.get('EmpEmail'),

                )
                self.stdout.write(self.style.SUCCESS(
                    f"Imported {row.get('first_name')} {row.get('last_name')}"
                ))
        self.stdout.write(self.style.SUCCESS("CSV import completed."))
