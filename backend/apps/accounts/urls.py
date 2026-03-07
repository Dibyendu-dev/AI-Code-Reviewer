from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import MeView, MyProfileView, ProfileViewSet, ProtectedView, RegisterView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet, basename='profiles')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('me/', MeView.as_view(), name='me'),
    path('me/profile/', MyProfileView.as_view(), name='my-profile'),
    path('', include(router.urls)),
]