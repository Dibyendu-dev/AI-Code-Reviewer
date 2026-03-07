from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile
from .serializers import MeSerializer, ProfileSerializer, RegisterSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProtectedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "You are authenticated!",
            "user": request.user.email
        })


class MeView(generics.RetrieveUpdateAPIView):
    """
    GET: View current user + profile
    PATCH/PUT: Update current user's profile fields
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MeSerializer

    def get_object(self):
        return self.request.user


class MyProfileView(generics.RetrieveUpdateDestroyAPIView):
    """
    /me/profile endpoint:
      - GET: retrieve your profile
      - PATCH/PUT: update
      - DELETE: delete your profile
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return profile


class ProfileViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for profiles (admin/staff only).
    """

    queryset = Profile.objects.select_related("user").all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAdminUser]