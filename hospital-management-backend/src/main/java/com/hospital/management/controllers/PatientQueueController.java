package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.PatientQueue;
import com.hospital.management.services.PatientQueueService;

@RestController
@RequestMapping("/api/queues")
public class PatientQueueController {
	
	private PatientQueueService patientQueueService;

	public PatientQueueController(PatientQueueService patientQueueService) {
		this.patientQueueService = patientQueueService;
	}
	
	@PostMapping("/token/{visitId}")
	public PatientQueue generatetoken(@PathVariable Long visitId) {
		
		return patientQueueService.generateToken(visitId);
	}
	
	@GetMapping
	public List<PatientQueue> getcurrentQueue(){
		
		return patientQueueService.getCurrentQueue();
	}
	
	@GetMapping("/{doctorId}")
	public List<PatientQueue> getDoctorQueue(@PathVariable Long doctorId) {

        return patientQueueService.getDoctorQueue(doctorId);
        
	}
	
	@PostMapping("/{queueId}/call")
	public PatientQueue callPatient(@PathVariable Long queueId) {
		return patientQueueService.callPatient(queueId);
	}
	
	@PostMapping("/{queueId}/complete")
	public PatientQueue completePatient(@PathVariable Long queueId) {
		
		return patientQueueService.completePatient(queueId);
	}

}
