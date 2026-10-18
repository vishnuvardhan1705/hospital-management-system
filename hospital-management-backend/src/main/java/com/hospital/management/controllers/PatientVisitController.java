package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PatientVisitRequest;
import com.hospital.management.entity.PatientVisit;
import com.hospital.management.services.PatientVisitService;

@RestController
@RequestMapping("/api/visits")
public class PatientVisitController {
	
	private PatientVisitService patientVisitService;

	public PatientVisitController(PatientVisitService patientVisitService) {
		this.patientVisitService = patientVisitService;
	}
	
	@PostMapping
	public PatientVisit createVisit(@RequestBody PatientVisitRequest request) {
		
		return patientVisitService.createVist(request);
	}
	
	@GetMapping
	public List<PatientVisit> getAllVisits(){
		
		return patientVisitService.findAllVisits();
	}
	
	@GetMapping("/{visitId}")
	public PatientVisit getSingleVisit(@PathVariable Long visitId) {
		
		return patientVisitService.getVisit(visitId);
	}
	
	@PostMapping("/{visitId}/check-in")
	public PatientVisit checkin(@PathVariable Long visitId) {
		
		return patientVisitService.checkIn(visitId);
	}

}
