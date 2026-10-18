package com.hospital.management.dto;

import java.time.LocalDate;

public class AdmissionRequest {
	
    private Long patientId;
    private Long doctorId;
    private Long departmentId;

    private LocalDate admissionDate;
    private String admissionReason;
    private String diagnosis;

    private Long wardId;
    private Long roomId;
    private Long bedId;

    private LocalDate expectedDischargeDate;
    private LocalDate actualDischargeDate;

    private String status;

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

	public Long getDepartmentId() {
		return departmentId;
	}

	public void setDepartmentId(Long departmentId) {
		this.departmentId = departmentId;
	}

	public LocalDate getAdmissionDate() {
		return admissionDate;
	}

	public void setAdmissionDate(LocalDate admissionDate) {
		this.admissionDate = admissionDate;
	}

	public String getAdmissionReason() {
		return admissionReason;
	}

	public void setAdmissionReason(String admissionReason) {
		this.admissionReason = admissionReason;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}

	public Long getWardId() {
		return wardId;
	}

	public void setWardId(Long wardId) {
		this.wardId = wardId;
	}

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public Long getBedId() {
		return bedId;
	}

	public void setBedId(Long bedId) {
		this.bedId = bedId;
	}

	public LocalDate getExpectedDischargeDate() {
		return expectedDischargeDate;
	}

	public void setExpectedDischargeDate(LocalDate expectedDischargeDate) {
		this.expectedDischargeDate = expectedDischargeDate;
	}

	public LocalDate getActualDischargeDate() {
		return actualDischargeDate;
	}

	public void setActualDischargeDate(LocalDate actualDischargeDate) {
		this.actualDischargeDate = actualDischargeDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
