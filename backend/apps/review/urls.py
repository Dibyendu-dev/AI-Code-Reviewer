from django.urls import path

from .views import review_code

urlpatterns = [
    # exposed at /api/review/ via project urls
    path('', review_code, name='review-code'),
]