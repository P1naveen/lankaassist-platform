package com.lankaassist.coordination_service.dto;

import java.time.LocalDateTime;

import com.lankaassist.coordination_service.entity.AllocationStatus;
import com.lankaassist.coordination_service.entity.ResourceAllocation;

public record AllocationResponse(
        Long id,
        Long assistanceRequestId,
        Long contributionId,
        AllocationStatus status,
        String notes,
        LocalDateTime createdAt
) {

    public static AllocationResponse from(
            ResourceAllocation allocation) {

        return new AllocationResponse(
                allocation.getId(),
                allocation.getAssistanceRequestId(),
                allocation.getContributionId(),
                allocation.getStatus(),
                allocation.getNotes(),
                allocation.getCreatedAt()
        );
    }
}