package com.lankaassist.identity_service.dto;

import com.lankaassist.identity_service.entity.Role;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresInSeconds,
        Long userId,
        String email,
        Role role,
        boolean anonymousDonor
) {
}