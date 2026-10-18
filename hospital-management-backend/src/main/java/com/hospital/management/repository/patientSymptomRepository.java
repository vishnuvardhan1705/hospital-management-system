package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PatientSymptom;

public interface patientSymptomRepository extends JpaRepository<PatientSymptom, Long> {

	List<PatientSymptom> findByConsultationConsultationId(Long consultationId);
}
