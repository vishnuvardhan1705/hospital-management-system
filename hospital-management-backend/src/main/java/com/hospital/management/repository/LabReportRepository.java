package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.LabReport;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {
	
	List<LabReport> findByPatientId(Long patientId);

    List<LabReport> findByLabOrderId(Long labOrderId);

}
