package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.LabReportRequest;
import com.hospital.management.entity.LabReport;
import com.hospital.management.services.LabReportService;

@RestController
@RequestMapping("/api/lab-reports")
public class LabReportController {
	
	private LabReportService labReportService;

	public LabReportController(LabReportService labReportService) {
		super();
		this.labReportService = labReportService;
	}
	
	@PostMapping
	public LabReport generatereport(@RequestBody LabReportRequest request) {
		
		return labReportService.generateReport(request);
	}
	
	@GetMapping("/{reportId}")
	public LabReport getReport(@PathVariable Long reportId) {
		
		return labReportService.getReport(reportId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<LabReport> getreportByPatient(@PathVariable Long patientId){
		
		return labReportService.getReportByPatient(patientId);
	}
	
	@GetMapping("/order/{orderId}")
	public List<LabReport> getReportByOrder(@PathVariable Long orderId){
		
		return labReportService.getReportByOrder(orderId);
	}

}
