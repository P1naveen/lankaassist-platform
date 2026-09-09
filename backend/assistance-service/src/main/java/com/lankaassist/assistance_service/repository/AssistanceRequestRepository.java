package com.lankaassist.assistance_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lankaassist.assistance_service.entity.AssistanceRequest;

public interface AssistanceRequestRepository
        extends JpaRepository<AssistanceRequest, Long> {

    List<AssistanceRequest> findAllByOrderByCreatedAtDesc();

    List<AssistanceRequest>
    findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
}
