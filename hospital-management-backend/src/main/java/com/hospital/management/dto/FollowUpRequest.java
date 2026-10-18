package com.hospital.management.dto;

import java.time.LocalDate;

public class FollowUpRequest {

    private Long patientId;
    private Long doctorId;
    private Long consultationId;
    private Long dischargeId;
    private LocalDate followUpDate;
    private String reason;
    private String notes;
    
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}
	public Long getConsultationId() {
		return consultationId;
	}
	public void setConsultationId(Long consultationId) {
		this.consultationId = consultationId;
	}
	public Long getDischargeId() {
		return dischargeId;
	}
	public void setDischargeId(Long dischargeId) {
		this.dischargeId = dischargeId;
	}
	public LocalDate getFollowUpDate() {
		return followUpDate;
	}
	public void setFollowUpDate(LocalDate followUpDate) {
		this.followUpDate = followUpDate;
	}
	public String getReason() {
		return reason;
	}
	public void setReason(String reason) {
		this.reason = reason;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
    
    
}
