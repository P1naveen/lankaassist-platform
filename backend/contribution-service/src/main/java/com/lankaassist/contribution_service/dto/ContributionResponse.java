package com.lankaassist.contribution_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.lankaassist.contribution_service.entity.Contribution;
import com.lankaassist.contribution_service.entity.ContributionStatus;
import com.lankaassist.contribution_service.entity.ContributionType;

public record ContributionResponse(
        Long id,
        Long assistanceRequestId,
        ContributionType contributionType,
        BigDecimal amount,
        String description,
        String donorLabel,
        ContributionStatus status,
        LocalDateTime createdAt
) {

    public static ContributionResponse from(
            Contribution contribution) {

        String donorLabel =
                contribution.isAnonymousDonor()
                        ? "Anonymous Donor"
                        : "Registered Donor";

        return new ContributionResponse(
                contribution.getId(),
                contribution.getAssistanceRequestId(),
                contribution.getContributionType(),
                contribution.getAmount(),
                contribution.getDescription(),
                donorLabel,
                contribution.getStatus(),
                contribution.getCreatedAt()
        );
    }
}
