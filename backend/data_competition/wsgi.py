"""
WSGI config for data_competition project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'data_competition.settings')
application = get_wsgi_application()
