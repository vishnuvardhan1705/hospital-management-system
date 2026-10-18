package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.entity.PharmacyTransaction;
import com.hospital.management.repository.PharmacyTransactionRepository;

@Service
public class PharmacyTransactionServiceImpl implements PharmacyTransactionService {
	
	private PharmacyTransactionRepository pharmacyTransactionRepository;

	public PharmacyTransactionServiceImpl(PharmacyTransactionRepository pharmacyTransactionRepository) {
		super();
		this.pharmacyTransactionRepository = pharmacyTransactionRepository;
	}

	@Override
	public List<PharmacyTransaction> getMedicineHistory(Long medicineId) {
		return pharmacyTransactionRepository.findByMedicineId(medicineId);
	}

	@Override
	public List<PharmacyTransaction> getBatchHistory(Long batchId) {
		return pharmacyTransactionRepository.findByBatchId(batchId);
	}

}
