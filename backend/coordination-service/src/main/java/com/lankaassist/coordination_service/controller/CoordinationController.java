package com.lankaassist.coordination_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lankaassist.coordination_service.dto.AllocationResponse;
import com.lankaassist.coordination_service.dto.CreateAllocationRequest;
import com.lankaassist.coordination_service.dto.UpdateAllocationStatusRequest;
import com.lankaassist.coordination_service.service.CoordinationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/allocations")
public class CoordinationController {

    private final CoordinationService coordinationService;

    public CoordinationController(
            CoordinationService coordinationService) {

        this.coordinationService = coordinationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AllocationResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody
            CreateAllocationRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        coordinationService.create(
                                getUserId(jwt),
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<AllocationResponse>>
    findAll() {

        return ResponseEntity.ok(
                coordinationService.findAll()
        );
    }

    @GetMapping("/request/{requestId}")
    public ResponseEntity<List<AllocationResponse>>
    findByRequest(@PathVariable Long requestId) {

        return ResponseEntity.ok(
                coordinationService.findByRequest(
                        requestId
                )
        );
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize(
        "hasAnyRole('ADMIN', 'VOLUNTEER')"
    )
    public ResponseEntity<AllocationResponse>
    updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody
            UpdateAllocationStatusRequest request) {

        return ResponseEntity.ok(
                coordinationService.updateStatus(
                        id,
                        request.status()
                )
        );
    }

    private Long getUserId(Jwt jwt) {

        Number userId = jwt.getClaim("userId");

        if (userId == null) {
            throw new IllegalArgumentException(
                    "JWT does not contain userId"
            );
        }

        return userId.longValue();
    }
}
