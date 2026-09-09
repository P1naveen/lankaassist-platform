package com.lankaassist.assistance_service.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.lankaassist.assistance_service.dto.AssistanceResponse;
import com.lankaassist.assistance_service.dto.CreateAssistanceRequest;
import com.lankaassist.assistance_service.entity.AssistanceRequest;
import com.lankaassist.assistance_service.entity.AssistanceType;
import com.lankaassist.assistance_service.entity.RequestStatus;
import com.lankaassist.assistance_service.repository.AssistanceRequestRepository;

@Service
public class AssistanceService {

    private final AssistanceRequestRepository repository;

    public AssistanceService(
            AssistanceRequestRepository repository) {

        this.repository = repository;
    }

    @Transactional
    public AssistanceResponse create(
            Long requesterId,
            CreateAssistanceRequest request) {

        if (request.assistanceType() == AssistanceType.MONEY
                && request.requestedAmount() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Requested amount is required for money assistance"
            );
        }

        AssistanceRequest entity = new AssistanceRequest(
                requesterId,
                request.beneficiaryType(),
                request.crisisType(),
                request.assistanceType(),
                request.title().trim(),
                request.description().trim(),
                request.district().trim(),
                request.requestedAmount()
        );

        return AssistanceResponse.from(
                repository.save(entity)
        );
    }

    @Transactional(readOnly = true)
    public List<AssistanceResponse> findAll() {

        return repository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AssistanceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssistanceResponse> findMine(
            Long requesterId) {

        return repository
                .findByRequesterIdOrderByCreatedAtDesc(
                        requesterId
                )
                .stream()
                .map(AssistanceResponse::from)
                .toList();
    }

    @Transactional
    public AssistanceResponse updateStatus(
            Long requestId,
            RequestStatus status) {

        AssistanceRequest request = repository
                .findById(requestId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Assistance request not found"
                        )
                );

        request.setStatus(status);

        return AssistanceResponse.from(
                repository.save(request)
        );
    }
}
