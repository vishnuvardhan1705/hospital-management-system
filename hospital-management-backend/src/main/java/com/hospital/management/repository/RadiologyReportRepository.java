package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.RadiologyReport;

public interface RadiologyReportRepository extends JpaRepository<RadiologyReport, Long> {

	List<RadiologyReport> findByPatientId(Long patientId);

    List<RadiologyReport> findByRadiologyOrderId(Long radiologyOrderId);
}
