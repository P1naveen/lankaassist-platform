package com.lankaassist.contribution_service.controller;

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

import com.lankaassist.contribution_service.dto.ContributionResponse;
import com.lankaassist.contribution_service.dto.CreateContributionRequest;
import com.lankaassist.contribution_service.dto.UpdateContributionStatusRequest;
import com.lankaassist.contribution_service.service.ContributionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contributions")
public class ContributionController {

    private final ContributionService contributionService;

    public ContributionController(
            ContributionService contributionService) {

        this.contributionService = contributionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ContributionResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody
            CreateContributionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        contributionService.create(
                                getUserId(jwt),
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<ContributionResponse>>
    findAll() {

        return ResponseEntity.ok(
                contributionService.findAll()
        );
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<List<ContributionResponse>>
    findMine(@AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                contributionService.findMine(
                        getUserId(jwt)
                )
        );
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContributionResponse>
    updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody
            UpdateContributionStatusRequest request) {

        return ResponseEntity.ok(
                contributionService.updateStatus(
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
