package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Consultation;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
	List<Consultation> findByPatientId(Long patientId);

    List<Consultation> findByDoctorId(Long doctorId);

    List<Consultation> findByVisitId(Long visitId);

}
