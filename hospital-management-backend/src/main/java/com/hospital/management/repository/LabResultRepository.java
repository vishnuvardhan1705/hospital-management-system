package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.LabResult;

public interface LabResultRepository extends JpaRepository<LabResult, Long> {

	List<LabResult> findByOrderItemId(Long orderItemId);

    List<LabResult> findByTestId(Long testId);
}
