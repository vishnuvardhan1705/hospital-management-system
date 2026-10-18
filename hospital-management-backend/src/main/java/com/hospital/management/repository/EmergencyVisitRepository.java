package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.EmergencyVisit;

public interface EmergencyVisitRepository extends JpaRepository<EmergencyVisit, Long> {

    List<EmergencyVisit> findByPatientId(Long patientId);

    List<EmergencyVisit> findByStatus(String status);
}
