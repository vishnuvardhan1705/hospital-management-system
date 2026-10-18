package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.MedicineDispensing;

public interface MedicineDispensingRepository extends JpaRepository<MedicineDispensing, Long> {
	
	List<MedicineDispensing> findByPatientId(Long patientId);

    List<MedicineDispensing> findByPrescriptionId(Long prescriptionId);

}
