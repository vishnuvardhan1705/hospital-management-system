package com.hospital.management.dto;

public class NursingAssignmentRequest {

    private Long nurseId;
    private Long patientId;
    private Long admissionId;
    private String status;
    
	public Long getNurseId() {
		return nurseId;
	}
	public void setNurseId(Long nurseId) {
		this.nurseId = nurseId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getAdmissionId() {
		return admissionId;
	}
	public void setAdmissionId(Long admissionId) {
		this.admissionId = admissionId;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
    
}
