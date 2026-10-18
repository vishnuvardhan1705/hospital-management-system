package com.hospital.management.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.ReportResponse;
import com.hospital.management.services.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

	private ReportService reportService;

	public ReportController(ReportService reportService) {
		super();
		this.reportService = reportService;
	}
	
	@GetMapping("/patients")
	public ReportResponse getPatientReport() {
	    return reportService.getPatientReport();
	}

	@GetMapping("/appointments")
	public ReportResponse getAppointmentReport() {
	    return reportService.getAppointmentReport();
	}

	@GetMapping("/financial")
	public ReportResponse getFinancialReport() {
	    return reportService.getFinancialReport();
	}

	@GetMapping("/pharmacy")
	public ReportResponse getPharmacyReport() {
	    return reportService.getPharmacyReport();
	}

	@GetMapping("/laboratory")
	public ReportResponse getLaboratoryReport() {
	    return reportService.getLaboratoryReport();
	}

	@GetMapping("/admissions")
	public ReportResponse getAdmissionReport() {
	    return reportService.getAdmissionReport();
	}
}
