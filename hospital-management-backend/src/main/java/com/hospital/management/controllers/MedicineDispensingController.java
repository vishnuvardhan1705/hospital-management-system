package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DispenseMedicineRequest;
import com.hospital.management.entity.MedicineDispensing;
import com.hospital.management.services.MedicineDispensingService;

@RestController
@RequestMapping("/api/pharmacy")
public class MedicineDispensingController {
	
	private MedicineDispensingService dispensingService;

	public MedicineDispensingController(MedicineDispensingService dispensingService) {
		super();
		this.dispensingService = dispensingService;
	}
	
	@PostMapping("/dispense")
	public MedicineDispensing dispenseMedicine(@RequestBody DispenseMedicineRequest request) {
		
		return dispensingService.dispenseMedicine(request);
	}
	
	@GetMapping("/dispensing/{dispenseId}")
	public MedicineDispensing getDispensing(@PathVariable Long dispenseId) {
		
		return dispensingService.getDispensing(dispenseId);
	}
	
	@GetMapping("/dispensing/patient/{patientId}")
	public List<MedicineDispensing> getPatientDispensing(@PathVariable Long patientId){
		
		return dispensingService.getPatientDispensing(patientId);
	}
	
	@GetMapping("/dispensing/prescription/{prescriptionId}")
	public List<MedicineDispensing> getPrescriptionDispensing(@PathVariable Long prescriptionId){
		
		return dispensingService.getPrescriptionDispensing(prescriptionId);
	}
} 
