package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

	List<Medicine> findByMedicineNameContainingIgnoreCase(String medicineName);
	List<Medicine> findByGenericNameContainingIgnoreCase(String genericName);
}
