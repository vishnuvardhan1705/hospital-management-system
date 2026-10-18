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

import com.hospital.management.dto.RadiologyReportRequest;
import com.hospital.management.entity.RadiologyReport;
import com.hospital.management.services.RadiologyReportService;

@RestController
@RequestMapping("/api/radiology-reports")
public class RadiologyReportController {
	
	private RadiologyReportService radiologyReportService;

	public RadiologyReportController(RadiologyReportService radiologyReportService) {
		super();
		this.radiologyReportService = radiologyReportService;
	}
	
	@PostMapping
	public RadiologyReport registerreport(@RequestBody RadiologyReportRequest request) {
		
		return radiologyReportService.uploadReport(request);
	}
	
	@PatchMapping("/{reportId}/verify")
    public RadiologyReport verifyReport(@PathVariable Long reportId,@RequestParam String verifiedBy) {

        return radiologyReportService.verifyReport(reportId, verifiedBy);
    }

    @GetMapping("/patient/{patientId}")
    public List<RadiologyReport> getPatientRadiologyHistory(@PathVariable Long patientId) {

        return radiologyReportService.getPatientRadiologyHistory(patientId);
    }

}
