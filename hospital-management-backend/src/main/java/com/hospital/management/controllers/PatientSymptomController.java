package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PatientSymptomRequest;
import com.hospital.management.entity.PatientSymptom;
import com.hospital.management.services.PatientSymptomService;

@RestController
@RequestMapping("/api/consultations")
public class PatientSymptomController {
	
	private PatientSymptomService patientSymptomService;

	public PatientSymptomController(PatientSymptomService patientSymptomService) {
		this.patientSymptomService = patientSymptomService;
	}
	
	@PostMapping("/{consultationId}/symptoms")
	public PatientSymptom addsymptom(@PathVariable Long consultationId,@RequestBody PatientSymptomRequest request) {
		
		return patientSymptomService.addSymptoms(consultationId, request);
	}
	
	@GetMapping("/symptoms/{symptomId}")
	public PatientSymptom getSymptom(@PathVariable Long symptomId) {
		
		return patientSymptomService.getSymptom(symptomId);
	}
	
	@GetMapping("/{consultationId}/symptoms")
	public List<PatientSymptom> getconsultationSymptom(@PathVariable Long consultationId){
		
		return patientSymptomService.getConsultationSymptom(consultationId);
	}
}
