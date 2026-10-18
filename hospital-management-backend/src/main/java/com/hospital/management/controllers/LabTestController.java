package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.LabTestsRequest;
import com.hospital.management.entity.LabTest;
import com.hospital.management.services.LabTestService;

@RestController
@RequestMapping("/api/lab-tests")
public class LabTestController {

	private LabTestService labTestService;

	public LabTestController(LabTestService labTestService) {
		super();
		this.labTestService = labTestService;
	}
	
	@PostMapping
	public LabTest createTest(@RequestBody LabTestsRequest request) {
		
		return labTestService.createLabTest(request);
	}
	
	@GetMapping
	public List<LabTest> getAllTests(){
		
		return labTestService.getAllLabTests();
	}
	
	@GetMapping("/{labTestId}")
	public LabTest getTest(@PathVariable Long labTestId) {
		
		return labTestService.getLabTest(labTestId);
	}
	
	@GetMapping("/search")
	public List<LabTest> searchTest(@RequestParam String testName){
		
		return labTestService.searchByTestName(testName);
	}
	
	@PutMapping("/{labTestId}")
	public LabTest updateTest(@PathVariable Long labTestId, @RequestBody LabTestsRequest request) {
		
		return labTestService.updateLabTest(labTestId, request);
	}
}
