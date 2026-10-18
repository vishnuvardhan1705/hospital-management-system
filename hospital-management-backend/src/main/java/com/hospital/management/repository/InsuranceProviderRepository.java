package com.hospital.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.InsuranceProvider;

public interface InsuranceProviderRepository extends JpaRepository<InsuranceProvider, Long> {

}
