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

import com.hospital.management.dto.RadiologyTestRequest;
import com.hospital.management.entity.RadiologyTest;
import com.hospital.management.services.RadiologyTestService;

@RestController
@RequestMapping("/api/radiology-tests")
public class RadiologyTestController {
	
	private RadiologyTestService radiologyTestService;

	public RadiologyTestController(RadiologyTestService radiologyTestService) {
		super();
		this.radiologyTestService = radiologyTestService;
	}
	

	@PostMapping
	public RadiologyTest createTest(@RequestBody RadiologyTestRequest request) {
		
		return radiologyTestService.createTest(request);
	}
	
	@GetMapping
	public List<RadiologyTest> getallTest(){
		
		return radiologyTestService.getAllTests();
	}
	
	@GetMapping("/{testId}")
	public RadiologyTest getRadiology(@PathVariable Long testId) {
		
		return radiologyTestService.getTest(testId);
	}
	
	@GetMapping("/search")
	public List<RadiologyTest> searchBytestName(@RequestParam String testName){
		
		return radiologyTestService.searchByTestName(testName);
	}
	
	@PutMapping("/{testId}")
	public RadiologyTest updateTest(@PathVariable Long testId, @RequestBody RadiologyTestRequest request) {
		
		return radiologyTestService.updateTest(testId, request);
	}
}
