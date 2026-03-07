import { apiClient } from "./client";

export const getMe = () => apiClient.get("me/");

export const updateMeProfile = (profile) =>
  apiClient.patch("me/", {
    profile,
  });

export const getMyProfile = () => apiClient.get("me/profile/");

export const updateMyProfile = (profile) => apiClient.patch("me/profile/", profile);

