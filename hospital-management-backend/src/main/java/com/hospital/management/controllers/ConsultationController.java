package com.hospital.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.ConsultationRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.services.ConsultationService;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {
	
	private ConsultationService consultationService;
	
	public ConsultationController(ConsultationService consultationService) {
		super();
		this.consultationService = consultationService;
	}

	@PostMapping
	public Consultation createConsultation(@RequestBody ConsultationRequest request) {
		
		return consultationService.createConsultation(request);
	}
	
	@GetMapping("/{consultationId}") 
	public Consultation getConsultation(@PathVariable Long consultationId) {
		
		return consultationService.getConsultation(consultationId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<Consultation> getPatientConsultation(@PathVariable Long patientId){
		
		return consultationService.getPatientConsultations(patientId);
	}
	
	@PutMapping("/{consultationId}")
	public Consultation updateConsultation(@PathVariable Long consultationId, @RequestBody ConsultationRequest request) {
		
		return consultationService.updateConsultation(consultationId, request);
	}

}
