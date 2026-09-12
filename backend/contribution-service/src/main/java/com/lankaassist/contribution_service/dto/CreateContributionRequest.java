package com.lankaassist.contribution_service.dto;

import com.lankaassist.contribution_service.entity.ContributionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateContributionRequest(

        @NotNull(message = "Assistance request ID is required")
        @Positive(message = "Assistance request ID must be positive")
        Long assistanceRequestId,

        @NotNull(message = "Contribution type is required")
        ContributionType contributionType,

        @DecimalMin(
                value = "0.01",
                message = "Amount must be positive"
        )
        BigDecimal amount,

        @NotBlank(message = "Description is required")
        @Size(min = 5, max = 500)
        String description,

        boolean anonymousDonor
        
) {
}
