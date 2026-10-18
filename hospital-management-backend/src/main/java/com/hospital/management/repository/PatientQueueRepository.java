package com.hospital.management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PatientQueue;

public interface PatientQueueRepository extends JpaRepository<PatientQueue, Long> {
	
	List<PatientQueue> findByDoctorIdAndQueueDateOrderByQueuePositionAsc(Long doctorId, LocalDate queueDate);
	List<PatientQueue> findByQueueDateAndStatusOrderByQueuePositionAsc(LocalDate queueDate, String status);
	List<PatientQueue> findByPatientIdAndQueueDate(Long patientId, LocalDate queueDate);
}
