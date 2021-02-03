import os

from hashlib import sha3_256

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = '@-&%tz4ftsib*iqnq5&7@2s+9xx$kw!de1es0-o%3hk28@o_7*'

DEBUG = True

ALLOWED_HOSTS = ['*']

UI_APP_NAME = 'react-ui'
UI_APP_DIR = os.path.join(BASE_DIR, UI_APP_NAME)
UI_APP_BUILD_DIR = os.path.join(UI_APP_DIR, 'build')
UI_APP_STATIC_DIR = os.path.join(UI_APP_BUILD_DIR, 'static')


CORS_URLS_REGEX = r'^.*$'
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000"
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'corsheaders',

    'api',
    'data_access'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'eye_of_sauron.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            UI_APP_BUILD_DIR
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'eye_of_sauron.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = (
    (UI_APP_STATIC_DIR),
)

PASSWORD_HASHING_ALGORITHM = sha3_256

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'api.serializers.CsrfExemptSessionAuthentication',
    ]
}

AUTH_USER_MODEL = 'data_access.User'

"""Порядок байт"""
BYTEORDER = 'big'

"""Команды устройств серверу"""
API_COMMANDS = {
    'SyncDateTime': 1,
    'SyncDeviceRoute': 2,
    'ReadCommit': 3,
    'AddRoutePoint': 4,
    'DeviceStatusReport': 5
}
