package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PatientInsurance;

public interface PatientInsuranceRepository extends JpaRepository<PatientInsurance, Long> {

	List<PatientInsurance> findByPatientId(Long patientId);
}
