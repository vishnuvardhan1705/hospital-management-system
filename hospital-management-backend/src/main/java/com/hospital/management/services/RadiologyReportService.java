package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.RadiologyReportRequest;
import com.hospital.management.entity.RadiologyReport;

public interface RadiologyReportService {
	
	public RadiologyReport uploadReport(RadiologyReportRequest request);

    public RadiologyReport verifyReport(Long reportId, String verifiedBy);

    public List<RadiologyReport> getPatientRadiologyHistory(Long patientId);

}
