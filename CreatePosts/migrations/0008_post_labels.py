# Generated by Django 5.1.5 on 2025-03-19 12:18

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CreatePosts', '0007_alter_comment_related_post'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='labels',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=255), default=list, size=None),
        ),
    ]
