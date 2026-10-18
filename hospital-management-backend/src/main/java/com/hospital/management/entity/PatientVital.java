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
@Table(name = "patient_vitals")
public class PatientVital {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vital_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visit_id", nullable = false)
    private PatientVisit visit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id", nullable = false)
    private Consultation consultation;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "pulse")
    private Integer pulse;

    @Column(name = "systolic_bp")
    private Integer systolicBp;

    @Column(name = "diastolic_bp")
    private Integer diastolicBp;

    @Column(name = "oxygen_saturation")
    private Double oxygenSaturation;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "height")
    private Double height;

    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    @Column(name = "recorded_by")
    private String recordedBy;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public PatientVisit getVisit() {
		return visit;
	}

	public void setVisit(PatientVisit visit) {
		this.visit = visit;
	}

	public Consultation getConsultation() {
		return consultation;
	}

	public void setConsultation(Consultation consultation) {
		this.consultation = consultation;
	}

	public Double getTemperature() {
		return temperature;
	}

	public void setTemperature(Double temperature) {
		this.temperature = temperature;
	}

	public Integer getPulse() {
		return pulse;
	}

	public void setPulse(Integer pulse) {
		this.pulse = pulse;
	}

	public Integer getSystolicBp() {
		return systolicBp;
	}

	public void setSystolicBp(Integer systolicBp) {
		this.systolicBp = systolicBp;
	}

	public Integer getDiastolicBp() {
		return diastolicBp;
	}

	public void setDiastolicBp(Integer diastolicBp) {
		this.diastolicBp = diastolicBp;
	}

	public Double getOxygenSaturation() {
		return oxygenSaturation;
	}

	public void setOxygenSaturation(Double oxygenSaturation) {
		this.oxygenSaturation = oxygenSaturation;
	}

	public Double getWeight() {
		return weight;
	}

	public void setWeight(Double weight) {
		this.weight = weight;
	}

	public Double getHeight() {
		return height;
	}

	public void setHeight(Double height) {
		this.height = height;
	}

	public Integer getRespiratoryRate() {
		return respiratoryRate;
	}

	public void setRespiratoryRate(Integer respiratoryRate) {
		this.respiratoryRate = respiratoryRate;
	}

	public String getRecordedBy() {
		return recordedBy;
	}

	public void setRecordedBy(String recordedBy) {
		this.recordedBy = recordedBy;
	}

	public LocalDateTime getRecordedAt() {
		return recordedAt;
	}

	public void setRecordedAt(LocalDateTime recordedAt) {
		this.recordedAt = recordedAt;
	}
    
}
