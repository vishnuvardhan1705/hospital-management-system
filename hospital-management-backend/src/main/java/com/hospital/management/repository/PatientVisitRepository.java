package com.hospital.management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PatientVisit;

public interface PatientVisitRepository extends JpaRepository<PatientVisit, Long> {
	List<PatientVisit> findByPatientId(Long patientId);
	List<PatientVisit> findByDoctorId(Long doctorId);
	List<PatientVisit> findByDepartmentId(Long departmentId);
	List<PatientVisit> findByVisitDate(LocalDate date);
	

}
