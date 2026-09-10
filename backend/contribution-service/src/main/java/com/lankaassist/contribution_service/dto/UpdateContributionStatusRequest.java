package com.lankaassist.contribution_service.dto;

import com.lankaassist.contribution_service.entity.ContributionStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateContributionStatusRequest(

        @NotNull(message = "Status is required")
        ContributionStatus status
) {
}