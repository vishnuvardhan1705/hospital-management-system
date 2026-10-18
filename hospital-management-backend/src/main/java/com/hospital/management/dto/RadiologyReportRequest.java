package com.hospital.management.dto;

public class RadiologyReportRequest {
    private Long radiologyOrderId;
    private Long patientId;
    private String findings;
    private String impression;
    private String reportedBy;
    
	public Long getRadiologyOrderId() {
		return radiologyOrderId;
	}
	public void setRadiologyOrderId(Long radiologyOrderId) {
		this.radiologyOrderId = radiologyOrderId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public String getFindings() {
		return findings;
	}
	public void setFindings(String findings) {
		this.findings = findings;
	}
	public String getImpression() {
		return impression;
	}
	public void setImpression(String impression) {
		this.impression = impression;
	}
	public String getReportedBy() {
		return reportedBy;
	}
	public void setReportedBy(String reportedBy) {
		this.reportedBy = reportedBy;
	}

}
