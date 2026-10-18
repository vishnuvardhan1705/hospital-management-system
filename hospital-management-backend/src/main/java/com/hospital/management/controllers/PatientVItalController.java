package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PatientVitalRequest;
import com.hospital.management.entity.PatientVital;
import com.hospital.management.services.PatientVitalService;

@RestController
@RequestMapping("/api/consultations")
public class PatientVItalController {
	
	private PatientVitalService patientVitalService;

	public PatientVItalController(PatientVitalService patientVitalService) {
		super();
		this.patientVitalService = patientVitalService;
	}
	
	@PostMapping("/{consultationId}/vitals")
	public PatientVital addVitals(@PathVariable Long consultationId,@RequestBody PatientVitalRequest request) {
		
		return patientVitalService.recordVital(consultationId, request);
	}
	
	@GetMapping("/vitals/{vitalId}")
	public PatientVital getVital(@PathVariable Long vitalId) {
		
		return patientVitalService.getVital(vitalId);
	}
	
	@GetMapping("/vitals/patient/{patientId}")
	public List<PatientVital> getPatientVital(@PathVariable Long patientId){
		
		return patientVitalService.getPatientVitals(patientId);
	}
	
	@GetMapping("/{consultationId}/vitals")
	public List<PatientVital> getConsultationVital(@PathVariable Long consultationId){
		
		return patientVitalService.getConsultationVitals(consultationId);
	}
}
