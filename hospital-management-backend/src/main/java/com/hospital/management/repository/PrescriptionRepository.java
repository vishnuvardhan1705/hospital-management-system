package com.hospital.management.repository;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long>{
	
    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByConsultationConsultationId(Long consultationId);

    List<Prescription> findByStatus(String status);

}
