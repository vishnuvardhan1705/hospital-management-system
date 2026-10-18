package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.NursingAssignment;

public interface NursingAssignmentRepository extends JpaRepository<NursingAssignment, Long> {

    List<NursingAssignment> findByNurseId(Long nurseId);

    List<NursingAssignment> findByPatientId(Long patientId);

    List<NursingAssignment> findByAdmissionId(Long admissionId);
}
