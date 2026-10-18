package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.BedAllocationRequest;
import com.hospital.management.entity.BedAllocation;
import com.hospital.management.services.BedAllocationService;

@RestController
@RequestMapping("/api/bed-allocations")
public class BedAllocationController {
	
	private BedAllocationService allocationService;

	public BedAllocationController(BedAllocationService allocationService) {
		super();
		this.allocationService = allocationService;
	}

	@PostMapping
	public BedAllocation allocateBed(@RequestBody BedAllocationRequest request) {
		
		return allocationService.allocateBed(request);
	}
	
	@PostMapping("/{allocationId}/release")
	public BedAllocation releaseBed(@PathVariable Long allocationId) {
		
		return allocationService.releaseBed(allocationId);
	}
	
	@GetMapping("/admission/{admissionId}")
	public List<BedAllocation> getadmissionHistory(@PathVariable Long admissionId){
		
		return allocationService.getAdmissionHistory(admissionId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<BedAllocation> getpatienthistory(@PathVariable Long patientId){
		
		return allocationService.getPatientHistory(patientId);
	}
}
