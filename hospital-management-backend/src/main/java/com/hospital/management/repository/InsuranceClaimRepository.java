package com.hospital.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.InsuranceClaim;

public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {

	Boolean existsByClaimNumber(String claimNumber);
}
