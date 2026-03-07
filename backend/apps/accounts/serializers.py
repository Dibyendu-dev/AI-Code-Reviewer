from rest_framework import serializers
from .models import Profile, User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "user_email",
            "first_name",
            "last_name",
            "phone",
            "bio",
            "location",
            "avatar_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_user(self, value):
        request = self.context.get("request")
        if request is None:
            return value
        if request.user and (request.user.is_staff or request.user.is_superuser):
            return value
        if value != request.user:
            raise serializers.ValidationError("You cannot set another user for this profile.")
        return value


class MeSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "email", "created_at", "profile"]
        read_only_fields = ["id", "email", "created_at"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)

        # No editable fields on User currently (email is read-only here),
        # but keep the structure for future expansion.
        instance.save()

        if profile_data is not None:
            profile, _ = Profile.objects.get_or_create(user=instance)
            for field, value in profile_data.items():
                setattr(profile, field, value)
            profile.save()

        return instance