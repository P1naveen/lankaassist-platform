package com.lankaassist.identity_service.dto;

import com.lankaassist.identity_service.entity.Role;

public record RegisterResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        boolean anonymousDonor,
        String message
) {
}