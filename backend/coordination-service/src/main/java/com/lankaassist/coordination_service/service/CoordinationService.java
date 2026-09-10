package com.lankaassist.coordination_service.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.lankaassist.coordination_service.dto.AllocationResponse;
import com.lankaassist.coordination_service.dto.CreateAllocationRequest;
import com.lankaassist.coordination_service.entity.AllocationStatus;
import com.lankaassist.coordination_service.entity.ResourceAllocation;
import com.lankaassist.coordination_service.repository.ResourceAllocationRepository;

@Service
public class CoordinationService {

    private final ResourceAllocationRepository repository;

    public CoordinationService(
            ResourceAllocationRepository repository) {

        this.repository = repository;
    }

    @Transactional
    public AllocationResponse create(
            Long coordinatorId,
            CreateAllocationRequest request) {

        if (repository.existsByContributionId(
                request.contributionId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Contribution is already allocated"
            );
        }

        ResourceAllocation allocation =
                new ResourceAllocation(
                        request.assistanceRequestId(),
                        request.contributionId(),
                        coordinatorId,
                        request.notes()
                );

        return AllocationResponse.from(
                repository.save(allocation)
        );
    }

    @Transactional(readOnly = true)
    public List<AllocationResponse> findAll() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AllocationResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AllocationResponse> findByRequest(
            Long assistanceRequestId) {

        return repository
                .findByAssistanceRequestIdOrderByCreatedAtDesc(
                        assistanceRequestId
                )
                .stream()
                .map(AllocationResponse::from)
                .toList();
    }

    @Transactional
    public AllocationResponse updateStatus(
            Long allocationId,
            AllocationStatus status) {

        ResourceAllocation allocation = repository
                .findById(allocationId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Allocation not found"
                        )
                );

        allocation.setStatus(status);

        return AllocationResponse.from(
                repository.save(allocation)
        );
    }
}
