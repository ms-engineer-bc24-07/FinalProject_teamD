# Generated by Django 3.2.25 on 2025-01-02 10:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('family', '0002_familygroup_references'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='familygroup',
            name='references',
        ),
    ]
