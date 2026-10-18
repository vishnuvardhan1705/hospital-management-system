package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PharmacyTransaction;

public interface PharmacyTransactionRepository extends JpaRepository<PharmacyTransaction, Long> {
	
	List<PharmacyTransaction> findByMedicineId(Long medicineId);

    List<PharmacyTransaction> findByBatchId(Long batchId);
}
