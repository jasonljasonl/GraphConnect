# Generated by Django 5.1.5 on 2025-02-20 12:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CreatePosts', '0006_comment_image_comment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='related_post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='CreatePosts.post'),
        ),
    ]
