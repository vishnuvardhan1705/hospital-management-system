package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.LabSampleRequest;
import com.hospital.management.entity.LabSample;
import com.hospital.management.services.LabSampleService;

@RestController
@RequestMapping("/api/lab-samples")
public class LabSampleController {
	
	private LabSampleService labSampleService;

	public LabSampleController(LabSampleService labSampleService) {
		super();
		this.labSampleService = labSampleService;
	}
	
	@PostMapping
	public LabSample registersample(@RequestBody LabSampleRequest request) {
		
		return labSampleService.registerSample(request);
	}
	
	@GetMapping("/{sampleId}")
	public LabSample getsample(@PathVariable Long sampleId) {
		
		return labSampleService.getLabSample(sampleId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<LabSample> getpatientSample(@PathVariable Long patientId){
		
		return labSampleService.getPatientSamples(patientId);
	}
	
	@GetMapping("/order/{labOrderId}")
	public List<LabSample> getOrderSample(@PathVariable Long labOrderId){
		
		return labSampleService.getSamplesByLabOrder(labOrderId);
	}
	
	@PatchMapping("/{sampleId}/status")
	public LabSample updateSample(@PathVariable Long sampleId,@RequestParam String status) {
		
		return labSampleService.updateSampleStatus(sampleId, status);
	}
}
