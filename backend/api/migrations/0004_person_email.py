# Generated by Django 5.1.6 on 2025-02-19 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0003_person_is_medical"),
    ]

    operations = [
        migrations.AddField(
            model_name="person",
            name="email",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
