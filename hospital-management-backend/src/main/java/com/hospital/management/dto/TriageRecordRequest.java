package com.hospital.management.dto;

public class TriageRecordRequest {

    private Long emergencyVisitId;
    private Long patientId;
    private String priority;
    private String symptoms;
    private String vitals;
    private String triageNotes;
    private String assessedBy;
    
	public Long getEmergencyVisitId() {
		return emergencyVisitId;
	}
	public void setEmergencyVisitId(Long emergencyVisitId) {
		this.emergencyVisitId = emergencyVisitId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public String getSymptoms() {
		return symptoms;
	}
	public void setSymptoms(String symptoms) {
		this.symptoms = symptoms;
	}
	public String getVitals() {
		return vitals;
	}
	public void setVitals(String vitals) {
		this.vitals = vitals;
	}
	public String getTriageNotes() {
		return triageNotes;
	}
	public void setTriageNotes(String triageNotes) {
		this.triageNotes = triageNotes;
	}
	public String getAssessedBy() {
		return assessedBy;
	}
	public void setAssessedBy(String assessedBy) {
		this.assessedBy = assessedBy;
	}
    
}
