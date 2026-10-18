package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Discharge;

public interface DischargeRepository extends JpaRepository<Discharge, Long> {

	List<Discharge> findByPatientId(Long patientId);
	boolean existsByAdmissionId(Long admissionId);
}
