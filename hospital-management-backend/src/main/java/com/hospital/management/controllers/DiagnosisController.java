package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DiagnosisRequest;
import com.hospital.management.entity.Diagnosis;
import com.hospital.management.services.DiagnosisService;

@RestController
@RequestMapping("/api/consultations")
public class DiagnosisController {
	
	private DiagnosisService diagnosisService;

	public DiagnosisController(DiagnosisService diagnosisService) {
		this.diagnosisService = diagnosisService;
	}
	
	@PostMapping("/{consultationId}/diagnosis") 
	public Diagnosis addDiagnosis(@PathVariable Long consultationId ,@RequestBody DiagnosisRequest request) {
		
		return diagnosisService.addDiagnosis(consultationId, request);
	}
	
	@GetMapping("/diagnosis/{diagnosisId}")
	public Diagnosis getDiagnosis(@PathVariable Long diagnosisId) {
		
		return diagnosisService.getDiagnosis(diagnosisId);
	}
	
	@GetMapping("/diagnosis/patient/{patientId}")
	public List<Diagnosis> getpatientDiagnosis(@PathVariable Long patientId){
		
		return diagnosisService.getPatientDiagnosis(patientId);
	}

	@GetMapping("/{consultationId}/diagnosis")
	public List<Diagnosis> getconsultationDiagnosis(@PathVariable Long consultationId){
		
		return diagnosisService.getConsutationDiagnosis(consultationId);
	}
}
