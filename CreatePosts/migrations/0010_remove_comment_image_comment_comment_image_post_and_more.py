# Generated by Django 5.1.7 on 2025-06-17 08:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('CreatePosts', '0009_alter_comment_image_comment_alter_post_image_post_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='image_comment',
        ),
        migrations.AddField(
            model_name='comment',
            name='image_post',
            field=models.ImageField(blank=True, upload_to='uploaded_images/'),
        ),
        migrations.AlterField(
            model_name='post',
            name='image_post',
            field=models.ImageField(blank=True, null=True, upload_to='profile_pictures/'),
        ),
    ]
