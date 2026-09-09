package com.lankaassist.identity_service.dto;

public record UserProfileResponse(
        Long userId,
        String email,
        String role
) {
}
