package com.lankaassist.identity_service.dto;

import com.lankaassist.identity_service.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100, message = "Full name must contain 2 to 100 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must contain at least 8 characters")
        String password,

        @NotNull(message = "Role is required")
        Role role,

        boolean anonymousDonor
) {
}
