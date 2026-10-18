package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PatientVital;

public interface PatientVitalRepository extends JpaRepository<PatientVital, Long> {

	List<PatientVital> findByPatientId(Long patientId);

    List<PatientVital> findByVisitId(Long visitId);

    List<PatientVital> findByConsultationConsultationId(Long consultationId);
}
