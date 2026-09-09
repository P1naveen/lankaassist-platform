package com.lankaassist.assistance_service.entity;

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
@Table(name = "assistance_requests")
public class AssistanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long requesterId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BeneficiaryType beneficiaryType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CrisisType crisisType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AssistanceType assistanceType;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(precision = 12, scale = 2)
    private BigDecimal requestedAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RequestStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public AssistanceRequest() {
    }

    public AssistanceRequest(
            Long requesterId,
            BeneficiaryType beneficiaryType,
            CrisisType crisisType,
            AssistanceType assistanceType,
            String title,
            String description,
            String district,
            BigDecimal requestedAmount) {

        this.requesterId = requesterId;
        this.beneficiaryType = beneficiaryType;
        this.crisisType = crisisType;
        this.assistanceType = assistanceType;
        this.title = title;
        this.description = description;
        this.district = district;
        this.requestedAmount = requestedAmount;
    }

    @PrePersist
    public void prepareNewRequest() {
        this.status = RequestStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public BeneficiaryType getBeneficiaryType() {
        return beneficiaryType;
    }

    public CrisisType getCrisisType() {
        return crisisType;
    }

    public AssistanceType getAssistanceType() {
        return assistanceType;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getDistrict() {
        return district;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
