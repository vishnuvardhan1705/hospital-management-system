package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.LabSample;

public interface LabSampleRepository extends JpaRepository<LabSample, Long> {

	List<LabSample> findByPatientId(Long patientId);

    List<LabSample> findByLabOrderId(Long labOrderId);

    List<LabSample> findByStatus(String status);
}
