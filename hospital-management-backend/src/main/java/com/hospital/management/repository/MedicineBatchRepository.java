package com.hospital.management.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.MedicineBatch;

public interface MedicineBatchRepository extends JpaRepository<MedicineBatch, Long> {

	List<MedicineBatch> findByMedicineId(Long medicineId);
	
	List<MedicineBatch> findByExpiryDateBefore(LocalDate date);
}
