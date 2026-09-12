package com.lankaassist.contribution_service.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.lankaassist.contribution_service.dto.ContributionResponse;
import com.lankaassist.contribution_service.dto.CreateContributionRequest;
import com.lankaassist.contribution_service.entity.Contribution;
import com.lankaassist.contribution_service.entity.ContributionStatus;
import com.lankaassist.contribution_service.entity.ContributionType;
import com.lankaassist.contribution_service.repository.ContributionRepository;

@Service
public class ContributionService {

    private final ContributionRepository repository;

    public ContributionService(
            ContributionRepository repository) {

        this.repository = repository;
    }

    @Transactional
    public ContributionResponse create(
            Long donorId,
            CreateContributionRequest request) {

        if (request.contributionType()
                == ContributionType.MONEY
                && request.amount() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Amount is required for money contributions"
            );
        }

        Contribution contribution = new Contribution(
                donorId,
                request.assistanceRequestId(),
                request.contributionType(),
                request.amount(),
                request.description().trim(),
                request.anonymousDonor()
        );

        return ContributionResponse.from(
                repository.save(contribution)
        );
    }

    @Transactional(readOnly = true)
    public List<ContributionResponse> findAll() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(ContributionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ContributionResponse> findMine(
            Long donorId) {

        return repository
                .findByDonorIdOrderByCreatedAtDesc(
                        donorId
                )
                .stream()
                .map(ContributionResponse::from)
                .toList();
    }

    @Transactional
    public ContributionResponse updateStatus(
            Long contributionId,
            ContributionStatus status) {

        Contribution contribution = repository
                .findById(contributionId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Contribution not found"
                        )
                );

        contribution.setStatus(status);

        return ContributionResponse.from(
                repository.save(contribution)
        );
    }
}
