package com.hospital.management.dto;

public class LabReportRequest {

	private Long labOrderId;
    private Long patientId;
    private String verifiedBy;
    
	public Long getLabOrderId() {
		return labOrderId;
	}
	public void setLabOrderId(Long labOrderId) {
		this.labOrderId = labOrderId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public String getVerifiedBy() {
		return verifiedBy;
	}
	public void setVerifiedBy(String verifiedBy) {
		this.verifiedBy = verifiedBy;
	}
    
}
