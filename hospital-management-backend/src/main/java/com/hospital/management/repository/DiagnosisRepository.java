package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Diagnosis;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {

	List<Diagnosis> findByPatientId(Long patientId);
	
	List<Diagnosis> findByConsultationConsultationId(Long consultationId);
}
