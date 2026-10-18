package com.hospital.management.dto;

public class BedAllocationRequest {
    private Long admissionId;
    private Long patientId;
    private Long bedId;
    
	public Long getAdmissionId() {
		return admissionId;
	}
	public void setAdmissionId(Long admissionId) {
		this.admissionId = admissionId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getBedId() {
		return bedId;
	}
	public void setBedId(Long bedId) {
		this.bedId = bedId;
	}

}
