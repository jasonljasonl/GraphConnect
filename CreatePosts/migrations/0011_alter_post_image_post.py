# Generated by Django 5.1.7 on 2025-06-17 09:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CreatePosts', '0010_remove_comment_image_comment_comment_image_post_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image_post',
            field=models.ImageField(blank=True, null=True, upload_to='uploaded_images/'),
        ),
    ]
