package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.LabTest;

public interface LabTestsRepository extends JpaRepository<LabTest, Long> {
	
	List<LabTest> findByTestNameContainingIgnoreCase(String testName);
	List<LabTest> findByCategoryContainingIgnoreCase(String category);

}
