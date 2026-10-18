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
@Table(name = "discharges")
public class Discharge {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "discharge_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false)
    private Admission admission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;

    @Column(name = "discharge_type")
    private String dischargeType;

    @Column(name = "final_diagnosis", columnDefinition = "TEXT")
    private String finalDiagnosis;

    @Column(name = "treatment_summary", columnDefinition = "TEXT")
    private String treatmentSummary;

    @Column(name = "condition_at_discharge", columnDefinition = "TEXT")
    private String conditionAtDischarge;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "status")
    private String status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Admission getAdmission() {
		return admission;
	}

	public void setAdmission(Admission admission) {
		this.admission = admission;
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

	public LocalDateTime getDischargeDate() {
		return dischargeDate;
	}

	public void setDischargeDate(LocalDateTime dischargeDate) {
		this.dischargeDate = dischargeDate;
	}

	public String getDischargeType() {
		return dischargeType;
	}

	public void setDischargeType(String dischargeType) {
		this.dischargeType = dischargeType;
	}

	public String getFinalDiagnosis() {
		return finalDiagnosis;
	}

	public void setFinalDiagnosis(String finalDiagnosis) {
		this.finalDiagnosis = finalDiagnosis;
	}

	public String getTreatmentSummary() {
		return treatmentSummary;
	}

	public void setTreatmentSummary(String treatmentSummary) {
		this.treatmentSummary = treatmentSummary;
	}

	public String getConditionAtDischarge() {
		return conditionAtDischarge;
	}

	public void setConditionAtDischarge(String conditionAtDischarge) {
		this.conditionAtDischarge = conditionAtDischarge;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

    
}
