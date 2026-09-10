package com.lankaassist.contribution_service.entity;

import java.math.BigDecimal;
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

@Entity
@Table(name = "contributions")
public class Contribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long donorId;

    @Column(nullable = false)
    private Long assistanceRequestId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContributionType contributionType;

    @Column(precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private boolean anonymousDonor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContributionStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Contribution() {
    }

    public Contribution(
            Long donorId,
            Long assistanceRequestId,
            ContributionType contributionType,
            BigDecimal amount,
            String description,
            boolean anonymousDonor) {

        this.donorId = donorId;
        this.assistanceRequestId = assistanceRequestId;
        this.contributionType = contributionType;
        this.amount = amount;
        this.description = description;
        this.anonymousDonor = anonymousDonor;
    }

    @PrePersist
    public void prepareNewContribution() {
        this.status = ContributionStatus.PLEDGED;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getDonorId() {
        return donorId;
    }

    public Long getAssistanceRequestId() {
        return assistanceRequestId;
    }

    public ContributionType getContributionType() {
        return contributionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public boolean isAnonymousDonor() {
        return anonymousDonor;
    }

    public ContributionStatus getStatus() {
        return status;
    }

    public void setStatus(ContributionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}