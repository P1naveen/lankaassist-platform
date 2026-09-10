package com.lankaassist.coordination_service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateAllocationRequest(

        @NotNull(message = "Assistance request ID is required")
        @Positive(message = "Assistance request ID must be positive")
        Long assistanceRequestId,

        @NotNull(message = "Contribution ID is required")
        @Positive(message = "Contribution ID must be positive")
        Long contributionId,

        @Size(max = 500, message = "Notes cannot exceed 500 characters")
        String notes
) {
}

