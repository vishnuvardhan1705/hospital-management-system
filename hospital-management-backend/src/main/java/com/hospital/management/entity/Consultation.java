package com.hospital.management.entity;

import java.time.LocalDate;
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
@Table(name = "consultations")
public class Consultation {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consultation_id")
    private Long consultationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visit_id", nullable = false)
    private PatientVisit visit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "consultation_date", nullable = false)
    private LocalDate consultationDate;

    @Column(name = "chief_complaint")
    private String chiefComplaint;

    @Column(name = "clinical_notes")
    private String clinicalNotes;

    @Column(name = "examination_notes")
    private String examinationNotes;

    @Column(name = "treatment_plan")
    private String treatmentPlan;

    @Column(name = "follow_up_required")
    private Boolean followUpRequired;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

	public Long getConsultationId() {
		return consultationId;
	}

	public void setConsultationId(Long consultationId) {
		this.consultationId = consultationId;
	}

	public PatientVisit getVisit() {
		return visit;
	}

	public void setVisit(PatientVisit visit) {
		this.visit = visit;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Doctor getDoctor() {
		return doctor;
	}

	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}

	public LocalDate getConsultationDate() {
		return consultationDate;
	}

	public void setConsultationDate(LocalDate consultationDate) {
		this.consultationDate = consultationDate;
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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

}
