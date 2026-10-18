package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PrescriptionItemRequest;
import com.hospital.management.dto.PrescriptionRequest;
import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.PrescriptionItem;
import com.hospital.management.services.PrescriptionService;

@RestController
@RequestMapping("/api")
public class PrescriptionController {
	
	private PrescriptionService prescriptionService;

	public PrescriptionController(PrescriptionService prescriptionService) {
		super();
		this.prescriptionService = prescriptionService;
	}

	@PostMapping("/consultations/{consultationId}/prescriptions")
	public Prescription createprescription(@PathVariable Long consultationId,@RequestBody PrescriptionRequest request) {
		
		return prescriptionService.createPrescription(consultationId, request);
	}
	
	@GetMapping("/prescriptions/{prescriptionId}")
	public Prescription getprescription(@PathVariable Long prescriptionId) {
		
		return prescriptionService.getPrescription(prescriptionId);
	}
	
	@GetMapping("/patients/{patientId}/prescriptions")
	public List<Prescription> getPatientprescription(@PathVariable Long patientId) {
		
		return prescriptionService.getPatientPrescriptions(patientId);
	}
	
	@GetMapping("/prescriptions/active")
	public List<Prescription> findallPrescritpion(){
		
		return prescriptionService.getActivePrescriptions();
	}
	
	@PutMapping("/consultations/{consultationId}/prescriptions")
	public Prescription updateprescription(@PathVariable Long consultationId,@RequestBody PrescriptionRequest request) {
		
		return prescriptionService.updatePrescription(consultationId, request);
	}
	
	@PostMapping("/prescriptions/{prescriptionId}/medicines")
	public PrescriptionItem addmedicine(@PathVariable Long prescriptionId,@RequestBody PrescriptionItemRequest request) {
		
		return prescriptionService.addMedicine(prescriptionId, request);
	}
	
	@GetMapping("/prescriptions/{prescriptionId}/medicines")
	public List<PrescriptionItem> findallitems(@PathVariable Long prescriptionId){
		
		return prescriptionService.getPrescriptionItems(prescriptionId);
	}
	
	@DeleteMapping("/prescription-item/{prescriptionItemId}")
	public void removeMedicine(@PathVariable Long prescriptionItemId) {
		
		prescriptionService.removeMedicine(prescriptionItemId);
	}
	
	@PostMapping("/prescriptions/{prescriptionId}/dispense")
	public Prescription markasDispensed(@PathVariable Long prescriptionId) {
		
		return prescriptionService.markAsDispensed(prescriptionId);
	}
}
