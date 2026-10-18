package com.hospital.management.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "emergency_visits")
public class EmergencyVisit {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emergency_visit_id")
    private Long emergencyVisitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "arrival_mode")
    private String arrivalMode;

    @Column(name = "chief_complaint")
    private String chiefComplaint;

    @Column(name = "priority")
    private String priority;

    
    private Long assignedDoctor;

    @Column(name = "status")
    private String status;

	public Long getEmergencyVisitId() {
		return emergencyVisitId;
	}

	public void setEmergencyVisitId(Long emergencyVisitId) {
		this.emergencyVisitId = emergencyVisitId;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public LocalDateTime getArrivalTime() {
		return arrivalTime;
	}

	public void setArrivalTime(LocalDateTime arrivalTime) {
		this.arrivalTime = arrivalTime;
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
