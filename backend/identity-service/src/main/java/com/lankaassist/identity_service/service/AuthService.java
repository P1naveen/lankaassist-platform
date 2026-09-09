package com.lankaassist.identity_service.service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lankaassist.identity_service.dto.LoginRequest;
import com.lankaassist.identity_service.dto.LoginResponse;
import com.lankaassist.identity_service.dto.RegisterRequest;
import com.lankaassist.identity_service.dto.RegisterResponse;
import com.lankaassist.identity_service.entity.Role;
import com.lankaassist.identity_service.entity.UserAccount;
import com.lankaassist.identity_service.exception.DuplicateEmailException;
import com.lankaassist.identity_service.exception.InvalidCredentialsException;
import com.lankaassist.identity_service.repository.UserAccountRepository;

@Service
public class AuthService {

    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String normalizedEmail = normalizeEmail(
                request.email()
        );

        if (userRepository.existsByEmailIgnoreCase(
                normalizedEmail)) {

            throw new DuplicateEmailException(
                    "An account already exists with this email address"
            );
        }

        if (request.role() == Role.ADMIN) {
            throw new IllegalArgumentException(
                    "Public users cannot register as administrators"
            );
        }

        boolean anonymousDonor =
                request.role() == Role.DONOR
                        && request.anonymousDonor();

        UserAccount user = new UserAccount(
                request.fullName().trim(),
                normalizedEmail,
                passwordEncoder.encode(request.password()),
                request.role(),
                anonymousDonor
        );

        UserAccount savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.isAnonymousDonor(),
                "Registration successful"
        );
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {

        String normalizedEmail = normalizeEmail(
                request.email()
        );

        UserAccount user = userRepository
                .findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(this::invalidCredentials);

        if (!passwordEncoder.matches(
                request.password(),
                user.getPasswordHash())) {

            throw invalidCredentials();
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                "Bearer",
                jwtService.getExpirationSeconds(),
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.isAnonymousDonor()
        );
    }

    private String normalizeEmail(String email) {
        return email
                .trim()
                .toLowerCase(Locale.ROOT);
    }

    private InvalidCredentialsException invalidCredentials() {
        return new InvalidCredentialsException(
                "Invalid email or password"
        );
    }
}