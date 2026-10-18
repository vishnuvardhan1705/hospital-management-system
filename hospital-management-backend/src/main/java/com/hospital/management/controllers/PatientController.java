package com.hospital.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PatientRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.services.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
	
	@Autowired
	private PatientService patientService;

	public PatientController(PatientService patientService) {
		this.patientService = patientService;
	}
	
	@GetMapping
	public List<Patient> getAllPatients(){
		List<Patient> patient = patientService.findAllPatient();
		
		return patient;
	}
	
	@GetMapping("/{id}")
	public Patient patientById(@PathVariable Long id) {
		Patient patient = patientService.findById(id);
		
		return patient;
	}
	
	@GetMapping("/search/mobile")
	public Patient patientByMobileNumber(@RequestParam String mobileNumber) {
		Patient patient = patientService.findByMobileNumber(mobileNumber);
		
		return patient;
	}
	
	@GetMapping("/search/name")
	public List<Patient> patientByName(@RequestParam String firstName){
		List<Patient> patient= patientService.findByFirstName(firstName);
		
		return patient;
	}

	@PostMapping
	public Patient createPatient(@RequestBody PatientRequest request) {
		Patient patient = patientService.registerPatient(request);
		
		return patient;
	}
	
	@PutMapping("/{id}")
	public Patient updatePatient(@PathVariable Long id ,@RequestBody PatientRequest request) {
		Patient patient = patientService.updatePatient(id, request);
		
		return patient;
	}
}
