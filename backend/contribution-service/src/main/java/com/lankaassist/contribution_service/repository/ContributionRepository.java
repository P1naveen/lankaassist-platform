package com.lankaassist.contribution_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lankaassist.contribution_service.entity.Contribution;

public interface ContributionRepository
        extends JpaRepository<Contribution, Long> {

    List<Contribution> findAllByOrderByCreatedAtDesc();

    List<Contribution>
    findByDonorIdOrderByCreatedAtDesc(Long donorId);
}
