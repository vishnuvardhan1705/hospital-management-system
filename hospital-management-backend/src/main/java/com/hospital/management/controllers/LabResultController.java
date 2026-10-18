package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.LabResultRequest;
import com.hospital.management.entity.LabResult;
import com.hospital.management.services.LabResultService;

@RestController
@RequestMapping("/api/lab-results")
public class LabResultController {

	private LabResultService labResultService;

	public LabResultController(LabResultService labResultService) {
		super();
		this.labResultService = labResultService;
	}
	
	@PostMapping
	public LabResult enterresult(@RequestBody LabResultRequest request) {
		
		return labResultService.enterLabResult(request);
	}
	
	@GetMapping("/{labResultId}")
	public LabResult getResult(@PathVariable Long labResultId) {
		
		return labResultService.getResult(labResultId);
	}
	
	@GetMapping("/order-item/{orderItemId}")
	public List<LabResult> getResultbyOrderitem(@PathVariable Long orderItemId){
		
		return labResultService.getResultByOrderItem(orderItemId);
	}
	
	@PatchMapping("/{resultId}/verify")
	public LabResult verifyresult(@PathVariable Long resultId,@RequestParam String verifiedBy) {
		
		return labResultService.verifyResult(resultId, verifiedBy);
	}
}
