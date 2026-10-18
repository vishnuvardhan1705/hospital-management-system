package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.MedicationAdministration;

public interface MedicationAdministrationRepository extends JpaRepository<MedicationAdministration, Long> {

    List<MedicationAdministration> findByPatientId(Long patientId);

    List<MedicationAdministration> findByAdmissionId(Long admissionId);
}
