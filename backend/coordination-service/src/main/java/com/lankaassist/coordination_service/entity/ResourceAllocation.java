package com.lankaassist.coordination_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "resource_allocations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_allocation_contribution",
            columnNames = "contribution_id"
        )
    }
)
public class ResourceAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assistance_request_id", nullable = false)
    private Long assistanceRequestId;

    @Column(name = "contribution_id", nullable = false)
    private Long contributionId;

    @Column(name = "coordinator_id", nullable = false)
    private Long coordinatorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AllocationStatus status;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ResourceAllocation() {
    }

    public ResourceAllocation(
            Long assistanceRequestId,
            Long contributionId,
            Long coordinatorId,
            String notes) {

        this.assistanceRequestId = assistanceRequestId;
        this.contributionId = contributionId;
        this.coordinatorId = coordinatorId;
        this.notes = notes;
    }

    @PrePersist
    public void prepareAllocation() {
        this.status = AllocationStatus.ASSIGNED;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getAssistanceRequestId() {
        return assistanceRequestId;
    }

    public Long getContributionId() {
        return contributionId;
    }

    public Long getCoordinatorId() {
        return coordinatorId;
    }

    public AllocationStatus getStatus() {
        return status;
    }

    public void setStatus(AllocationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}