package com.lankaassist.assistance_service.dto;

import com.lankaassist.assistance_service.entity.RequestStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(

        @NotNull(message = "Status is required")
        RequestStatus status
) {
}
