package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Admission;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {
	
	List<Admission> findByPatientId(Long patientId);

    List<Admission> findByStatus(String status);

}
