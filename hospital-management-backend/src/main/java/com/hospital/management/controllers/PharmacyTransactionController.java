package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.PharmacyTransaction;
import com.hospital.management.services.PharmacyTransactionService;

@RestController
@RequestMapping("/api/pharmacy/transactions")
public class PharmacyTransactionController {
	
	private PharmacyTransactionService pharmacyTransactionService;

	public PharmacyTransactionController(PharmacyTransactionService pharmacyTransactionService) {
		super();
		this.pharmacyTransactionService = pharmacyTransactionService;
	}
	
	@GetMapping("/medicine/{medicineId}")
	public List<PharmacyTransaction> getmedicineHistory(@PathVariable Long medicineId) {
		
		return pharmacyTransactionService.getMedicineHistory(medicineId);
	}
	
	@GetMapping("/batch/{batchId}")
	public List<PharmacyTransaction> getBatchhistory(@PathVariable Long batchId){
		
		return pharmacyTransactionService.getBatchHistory(batchId);
	}
}
