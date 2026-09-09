package com.lankaassist.assistance_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.lankaassist.assistance_service.entity.AssistanceRequest;
import com.lankaassist.assistance_service.entity.AssistanceType;
import com.lankaassist.assistance_service.entity.BeneficiaryType;
import com.lankaassist.assistance_service.entity.CrisisType;
import com.lankaassist.assistance_service.entity.RequestStatus;

public record AssistanceResponse(
        Long id,
        BeneficiaryType beneficiaryType,
        CrisisType crisisType,
        AssistanceType assistanceType,
        String title,
        String description,
        String district,
        BigDecimal requestedAmount,
        RequestStatus status,
        LocalDateTime createdAt
) {

    public static AssistanceResponse from(
            AssistanceRequest request) {

        return new AssistanceResponse(
                request.getId(),
                request.getBeneficiaryType(),
                request.getCrisisType(),
                request.getAssistanceType(),
                request.getTitle(),
                request.getDescription(),
                request.getDistrict(),
                request.getRequestedAmount(),
                request.getStatus(),
                request.getCreatedAt()
        );
    }
}
