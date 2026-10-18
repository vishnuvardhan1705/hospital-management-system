package com.hospital.management.dto;

import java.time.LocalDate;

public class ConsultationRequest {
	private Long visitId;
    private Long patientId;
    private Long doctorId;

    private String chiefComplaint;
    private String clinicalNotes;
    private String examinationNotes;
    private String treatmentPlan;

    private Boolean followUpRequired;
    private LocalDate followUpDate;
	public Long getVisitId() {
		return visitId;
	}
	public void setVisitId(Long visitId) {
		this.visitId = visitId;
	}
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
	public String getChiefComplaint() {
		return chiefComplaint;
	}
	public void setChiefComplaint(String chiefComplaint) {
		this.chiefComplaint = chiefComplaint;
	}
	public String getClinicalNotes() {
		return clinicalNotes;
	}
	public void setClinicalNotes(String clinicalNotes) {
		this.clinicalNotes = clinicalNotes;
	}
	public String getExaminationNotes() {
		return examinationNotes;
	}
	public void setExaminationNotes(String examinationNotes) {
		this.examinationNotes = examinationNotes;
	}
	public String getTreatmentPlan() {
		return treatmentPlan;
	}
	public void setTreatmentPlan(String treatmentPlan) {
		this.treatmentPlan = treatmentPlan;
	}
	public Boolean getFollowUpRequired() {
		return followUpRequired;
	}
	public void setFollowUpRequired(Boolean followUpRequired) {
		this.followUpRequired = followUpRequired;
	}
	public LocalDate getFollowUpDate() {
		return followUpDate;
	}
	public void setFollowUpDate(LocalDate followUpDate) {
		this.followUpDate = followUpDate;
	}

}
