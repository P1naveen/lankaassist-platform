package com.lankaassist.assistance_service.dto;

import java.math.BigDecimal;

import com.lankaassist.assistance_service.entity.AssistanceType;
import com.lankaassist.assistance_service.entity.BeneficiaryType;
import com.lankaassist.assistance_service.entity.CrisisType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateAssistanceRequest(

        @NotNull(message = "Beneficiary type is required")
        BeneficiaryType beneficiaryType,

        @NotNull(message = "Crisis type is required")
        CrisisType crisisType,

        @NotNull(message = "Assistance type is required")
        AssistanceType assistanceType,

        @NotBlank(message = "Title is required")
        @Size(min = 5, max = 120)
        String title,

        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 1000)
        String description,

        @NotBlank(message = "District is required")
        @Size(max = 50)
        String district,

        @DecimalMin(value = "0.01", message = "Amount must be positive")
        BigDecimal requestedAmount
) {
}