package com.hospital.management.dto;

public class NursingNotesRequest {

    private Long patientId;
    private Long admissionId;
    private Long nurseId;
    private String observation;
    private String actionTaken;
    
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
	public Long getNurseId() {
		return nurseId;
	}
	public void setNurseId(Long nurseId) {
		this.nurseId = nurseId;
	}
	public String getObservation() {
		return observation;
	}
	public void setObservation(String observation) {
		this.observation = observation;
	}
	public String getActionTaken() {
		return actionTaken;
	}
	public void setActionTaken(String actionTaken) {
		this.actionTaken = actionTaken;
	}
  
}
