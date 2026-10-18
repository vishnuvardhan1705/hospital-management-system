package com.hospital.management.dto;

public class SurgeryRequestDto {

    private Long patientId;
    private Long admissionId;
    private Long doctorId;
    private Long surgeryTypeId;
    private String reason;
    private String priority;
    
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
	public Long getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}
	public Long getSurgeryTypeId() {
		return surgeryTypeId;
	}
	public void setSurgeryTypeId(Long surgeryTypeId) {
		this.surgeryTypeId = surgeryTypeId;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
    
}
