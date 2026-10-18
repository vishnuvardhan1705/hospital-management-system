package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Surgery;

public interface SurgeryRepository extends JpaRepository<Surgery, Long> {

    List<Surgery> findByPatientId(Long patientId);

    List<Surgery> findByStatus(String status);
}
