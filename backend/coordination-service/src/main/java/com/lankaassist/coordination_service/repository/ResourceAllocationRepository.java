package com.lankaassist.coordination_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lankaassist.coordination_service.entity.ResourceAllocation;

public interface ResourceAllocationRepository
        extends JpaRepository<ResourceAllocation, Long> {

    boolean existsByContributionId(Long contributionId);

    List<ResourceAllocation>
    findAllByOrderByCreatedAtDesc();

    List<ResourceAllocation>
    findByAssistanceRequestIdOrderByCreatedAtDesc(
            Long assistanceRequestId
    );
}

