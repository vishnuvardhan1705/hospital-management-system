package com.hospital.management.dto;

public class EmergencyVisitRequest {

    private Long patientId;
    private String arrivalMode;
    private String chiefComplaint;
    private String priority;
    private Long assignedDoctor;
    private String status;
    
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public String getArrivalMode() {
		return arrivalMode;
	}
	public void setArrivalMode(String arrivalMode) {
		this.arrivalMode = arrivalMode;
	}
	public String getChiefComplaint() {
		return chiefComplaint;
	}
	public void setChiefComplaint(String chiefComplaint) {
		this.chiefComplaint = chiefComplaint;
	}
	public String getPriority() {
		return priority;
	}
	public void setPriority(String priority) {
		this.priority = priority;
	}
	public Long getAssignedDoctor() {
		return assignedDoctor;
	}
	public void setAssignedDoctor(Long assignedDoctor) {
		this.assignedDoctor = assignedDoctor;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
    
}
