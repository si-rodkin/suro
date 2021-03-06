# Generated by Django 3.0.9 on 2021-05-09 12:04

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imei', models.CharField(db_index=True, max_length=17, unique=True, verbose_name='IMEI')),
                ('name', models.CharField(max_length=128, unique=True, verbose_name='Имя устройства')),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(db_index=True, max_length=128, region=None, unique=True, verbose_name='Номер GSM-модуля')),
            ],
            options={
                'verbose_name': 'Устройство',
                'verbose_name_plural': 'Устройства',
                'db_table': 'Devices',
            },
        ),
        migrations.CreateModel(
            name='GuardedObject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64, unique=True, verbose_name='Наименование объекта')),
                ('itn', models.CharField(max_length=12, unique=True, verbose_name='Индивидуальный номер налогоплательщика')),
            ],
            options={
                'verbose_name': 'Охраняемый объект',
                'verbose_name_plural': 'Охраняемые объекты',
                'db_table': 'Objects',
            },
        ),
        migrations.CreateModel(
            name='GuardRoute',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True, verbose_name='Наименование')),
                ('devices', models.ManyToManyField(blank=True, related_name='guard_routes', to='data_access.Device', verbose_name='Устройство обхода')),
                ('guard_object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='guard_routes', to='data_access.GuardedObject', verbose_name='Охраняемый объект')),
            ],
            options={
                'verbose_name': 'Маршрут охраны',
                'verbose_name_plural': 'Маршруты охраны',
                'db_table': 'GuardRoutes',
            },
        ),
        migrations.CreateModel(
            name='Marker',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Новый маркер', max_length=50, verbose_name='Название маркера')),
                ('rfid', models.CharField(max_length=10, unique=True, verbose_name='Номер RFID-карты')),
                ('route', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='markers', to='data_access.GuardRoute', verbose_name='Маршрут')),
            ],
            options={
                'verbose_name': 'Маркер',
                'verbose_name_plural': 'Маркеры',
                'db_table': 'Markers',
            },
        ),
        migrations.CreateModel(
            name='Round',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='Наименование')),
                ('days', models.IntegerField(verbose_name='Дни обхода')),
                ('start_time', models.TimeField(verbose_name='Время начала обхода')),
                ('end_time', models.TimeField(null=True, verbose_name='Время окончания обхода')),
                ('time_allowance', models.IntegerField(verbose_name='Время допуска')),
                ('late_time', models.IntegerField(verbose_name='Время опоздания')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rounds', to='data_access.Device', verbose_name='Устройство')),
                ('marker', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rounds', to='data_access.Marker', verbose_name='Маркер')),
            ],
            options={
                'verbose_name': 'Обход',
                'verbose_name_plural': 'Обходы',
                'db_table': 'Rounds',
            },
        ),
        migrations.CreateModel(
            name='Commit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(verbose_name='Дата обмена информацией')),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_access.Device')),
                ('marker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_access.Marker')),
                ('round', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data_access.Round')),
            ],
            options={
                'verbose_name': 'Синхронизация с устройством',
                'db_table': 'Commits',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('personnel_number', models.IntegerField(null=True, verbose_name='Табельный номер')),
                ('patr_name', models.CharField(blank=True, max_length=32, null=True, verbose_name='Отчество')),
                ('position', models.CharField(max_length=128, verbose_name='Должность')),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(db_index=True, max_length=128, region=None, unique=True, verbose_name='Телефонный номер')),
                ('timezone', models.CharField(default='Europe/Moscow', max_length=32, verbose_name='Часовой пояс')),
                ('avatar', models.ImageField(blank=True, null=True, upload_to='', verbose_name='Аватар пользователя')),
                ('is_leading', models.BooleanField(default=False, verbose_name='Является ли управленцем')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('lead', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Руководитель')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Пользователь системы',
                'verbose_name_plural': 'Пользователи системы',
                'db_table': 'Users',
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]
