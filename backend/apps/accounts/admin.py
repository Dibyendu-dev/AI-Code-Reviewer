from django.contrib import admin

from .models import Profile, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    ordering = ["id"]
    list_display = ["id", "email", "is_staff", "is_active", "created_at"]
    search_fields = ["email"]
    list_filter = ("is_staff", "is_active")
    readonly_fields = ("created_at", "last_login")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "first_name", "last_name", "phone", "updated_at"]
    search_fields = ["user__email", "first_name", "last_name", "phone"]
