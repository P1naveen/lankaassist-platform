package com.lankaassist.identity_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lankaassist.identity_service.dto.LoginRequest;
import com.lankaassist.identity_service.dto.LoginResponse;
import com.lankaassist.identity_service.dto.RegisterRequest;
import com.lankaassist.identity_service.dto.RegisterResponse;
import com.lankaassist.identity_service.dto.UserProfileResponse;
import com.lankaassist.identity_service.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> currentUser(
            @AuthenticationPrincipal Jwt jwt) {

        Number userId = jwt.getClaim("userId");
        String role = jwt.getClaimAsString("role");

        UserProfileResponse response =
                new UserProfileResponse(
                        userId.longValue(),
                        jwt.getSubject(),
                        role
                );

        return ResponseEntity.ok(response);
    }
}

