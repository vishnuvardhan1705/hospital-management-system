package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.LabReportRequest;
import com.hospital.management.entity.LabReport;

public interface LabReportService {

	public LabReport generateReport(LabReportRequest request);
	public LabReport getReport(Long reportId);
	public List<LabReport> getReportByPatient(Long patientId);
	public List<LabReport> getReportByOrder(Long orderId);
}
