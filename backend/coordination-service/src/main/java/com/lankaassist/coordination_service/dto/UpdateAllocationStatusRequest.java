package com.lankaassist.coordination_service.dto;

import com.lankaassist.coordination_service.entity.AllocationStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateAllocationStatusRequest(

        @NotNull(message = "Status is required")
        AllocationStatus status
) {
}