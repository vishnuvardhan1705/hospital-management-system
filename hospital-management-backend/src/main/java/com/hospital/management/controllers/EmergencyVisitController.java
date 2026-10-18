package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.EmergencyVisitRequest;
import com.hospital.management.entity.EmergencyVisit;
import com.hospital.management.services.EmergencyVisitService;

@RestController
@RequestMapping("/api/emergency-visits")
public class EmergencyVisitController {

	private EmergencyVisitService emergencyVisitService;

	public EmergencyVisitController(EmergencyVisitService emergencyVisitService) {
		super();
		this.emergencyVisitService = emergencyVisitService;
	}
	
	@PostMapping
	public EmergencyVisit createVisit(@RequestBody EmergencyVisitRequest request) {
		
		return emergencyVisitService.createEmergencyVisit(request);
	}
	
	@GetMapping
	public List<EmergencyVisit> getAllEmergencyvisits(){
		
		return emergencyVisitService.getAllEmergencyVisits();
	}
	
	@GetMapping("/{visitId}")
	public EmergencyVisit getVisit(@PathVariable Long visitId) {
		
		return emergencyVisitService.getEmergencyVisit(visitId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<EmergencyVisit> getPatientEmergencyvisit(@PathVariable Long patientId){
		
		return emergencyVisitService.getPatientEmergencyVisits(patientId);
	}
	
	@PutMapping("/{visitId}")
	public EmergencyVisit updateEmergencyVist(@PathVariable Long visitId, @RequestBody EmergencyVisitRequest request) {
		
		return emergencyVisitService.updateEmergencyVisit(visitId, request);
	}
	
	@PatchMapping("/{emergencyVisitId}/doctor/{doctorId}")
    public EmergencyVisit assignDoctor(@PathVariable Long emergencyVisitId,@PathVariable Long doctorId) {
        
		return emergencyVisitService.assignDoctor(emergencyVisitId, doctorId);
	}
	
	@PostMapping("/{emergencyVisitId}/treatment")
	public EmergencyVisit recordEmergencyTreatment(@PathVariable Long emergencyVisitId) {

	    return emergencyVisitService.recordEmergencyTreatment(emergencyVisitId);
	}

	@PostMapping("/{emergencyVisitId}/discharge")
	public EmergencyVisit dischargeEmergencyPatient(@PathVariable Long emergencyVisitId) {

	    return emergencyVisitService.dischargeEmergencyPatient(emergencyVisitId);
	}
}
