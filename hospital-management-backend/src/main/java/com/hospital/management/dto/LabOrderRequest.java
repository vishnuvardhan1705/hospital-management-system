package com.hospital.management.dto;

import java.util.List;

public class LabOrderRequest {
	
	private Long patientId;
    private Long consultationId;
    private Long doctorId;

    private String priority;
    private String status;

    private List<Long> testIds;

	public Long getPatientId() {
		return patientId;
	}

	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}

	public Long getConsultationId() {
		return consultationId;
	}

	public void setConsultationId(Long consultationId) {
		this.consultationId = consultationId;
	}

	public Long getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<Long> getTestIds() {
		return testIds;
	}

	public void setTestIds(List<Long> testIds) {
		this.testIds = testIds;
	}

}
