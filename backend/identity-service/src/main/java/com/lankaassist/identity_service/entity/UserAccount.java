package com.lankaassist.identity_service.entity;



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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_users_email", columnNames = "email")
    }
)
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    private boolean anonymousDonor = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public UserAccount() {
    }

    public UserAccount(
            String fullName,
            String email,
            String passwordHash,
            Role role,
            boolean anonymousDonor) {

        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.anonymousDonor = anonymousDonor;
    }

    @PrePersist
    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isAnonymousDonor() {
        return anonymousDonor;
    }

    public void setAnonymousDonor(boolean anonymousDonor) {
        this.anonymousDonor = anonymousDonor;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
