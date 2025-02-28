# Generated by Django 5.0.6 on 2024-06-11 17:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('categoria_producto', models.CharField(max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='numeroOrden',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('numero', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Productos',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=1000)),
                ('descripcion', models.TextField(blank=True)),
                ('imagen', models.CharField(max_length=1000)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('estado', models.CharField(max_length=100)),
                ('cantidad', models.IntegerField()),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='adminInventario2.categoria')),
            ],
        ),
    ]
