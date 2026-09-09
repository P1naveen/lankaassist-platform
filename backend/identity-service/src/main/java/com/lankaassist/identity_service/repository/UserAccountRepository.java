package com.lankaassist.identity_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lankaassist.identity_service.entity.UserAccount;

public interface UserAccountRepository
        extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
