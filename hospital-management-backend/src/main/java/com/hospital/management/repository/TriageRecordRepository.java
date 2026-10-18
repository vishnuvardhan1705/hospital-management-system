package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.TriageRecord;

public interface TriageRecordRepository extends JpaRepository<TriageRecord, Long> {

	List<TriageRecord> findByPatientId(Long patientId);
	List<TriageRecord> findByEmergencyVisitEmergencyVisitId(Long emergencyVisitId);
}
