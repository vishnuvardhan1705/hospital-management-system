package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.RadiologyTest;

public interface RadiologyTestRepository extends JpaRepository<RadiologyTest, Long> {

	List<RadiologyTest> findByTestNameContainingIgnoreCase(String testName);
	List<RadiologyTest> findByModalityContainingIgnoreCase(String modality);
}
