# Generated by Django 4.2.2 on 2023-07-17 01:33

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chains", "0007_alter_chainnode_config"),
    ]

    operations = [
        migrations.AddField(
            model_name="nodetype",
            name="config_schema",
            field=models.JSONField(default=dict),
        ),
    ]
