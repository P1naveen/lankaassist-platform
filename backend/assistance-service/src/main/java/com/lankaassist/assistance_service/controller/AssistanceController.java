package com.lankaassist.assistance_service.controller;

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

import com.lankaassist.assistance_service.dto.AssistanceResponse;
import com.lankaassist.assistance_service.dto.CreateAssistanceRequest;
import com.lankaassist.assistance_service.dto.UpdateStatusRequest;
import com.lankaassist.assistance_service.service.AssistanceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/assistance")
public class AssistanceController {

    private final AssistanceService assistanceService;

    public AssistanceController(
            AssistanceService assistanceService) {

        this.assistanceService = assistanceService;
    }

    @PostMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<AssistanceResponse> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody
            CreateAssistanceRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        assistanceService.create(
                                getUserId(jwt),
                                request
                        )
                );
    }

    @GetMapping
    public ResponseEntity<List<AssistanceResponse>>
    findAll() {

        return ResponseEntity.ok(
                assistanceService.findAll()
        );
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<List<AssistanceResponse>>
    findMine(@AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                assistanceService.findMine(
                        getUserId(jwt)
                )
        );
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AssistanceResponse>
    updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody
            UpdateStatusRequest request) {

        return ResponseEntity.ok(
                assistanceService.updateStatus(
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
