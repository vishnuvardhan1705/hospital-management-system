package com.hospital.management.services;

import java.util.List;

import com.hospital.management.entity.PharmacyTransaction;

public interface PharmacyTransactionService {

	List<PharmacyTransaction> getMedicineHistory(Long medicineId);

    List<PharmacyTransaction> getBatchHistory(Long batchId);
}
