from django.db import models

class Person(models.Model):
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    location   = models.CharField(max_length=100)
    city       = models.CharField(max_length=100)
    state      = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    position   = models.CharField(max_length=100)
    zip_code   = models.CharField(max_length=5)
    latitude   = models.CharField(max_length=100, null=True, blank=True)
    longitude  = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
