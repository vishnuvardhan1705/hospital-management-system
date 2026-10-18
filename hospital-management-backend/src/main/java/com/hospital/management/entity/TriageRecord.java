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
@Table(name = "trage_records")
public class TriageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "triage_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emergency_visit_id", nullable = false)
    private EmergencyVisit emergencyVisit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "priority")
    private String priority;

    @Column(name = "symptoms")
    private String symptoms;

    @Column(name = "vitals")
    private String vitals;

    @Column(name = "triage_notes")
    private String triageNotes;

    @Column(name = "assessed_by")
    private String assessedBy;

    @Column(name = "assessed_at")
    private LocalDateTime assessedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public EmergencyVisit getEmergencyVisit() {
		return emergencyVisit;
	}

	public void setEmergencyVisit(EmergencyVisit emergencyVisit) {
		this.emergencyVisit = emergencyVisit;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
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

	public LocalDateTime getAssessedAt() {
		return assessedAt;
	}

	public void setAssessedAt(LocalDateTime assessedAt) {
		this.assessedAt = assessedAt;
	}

}
