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
@Table(name = "patient_queues")
public class PatientQueue {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "queue_id")
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "visit_id",nullable = false)
	private PatientVisit patientVisit;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "patient_id",nullable = false)
	private Patient patient;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "doctor_id",nullable = false)
	private Doctor doctor;
	
	@Column(nullable = false)
	private Integer tokenNumber;
	
	@Column(nullable = false)
	private LocalDate queueDate;
	
	private Integer queuePosition;
	
	private String status;
	
	private LocalDateTime calledAt;
	
	private LocalDateTime completedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public PatientVisit getPatientVisit() {
		return patientVisit;
	}

	public void setPatientVisit(PatientVisit patientVisit) {
		this.patientVisit = patientVisit;
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

	public Integer getTokenNumber() {
		return tokenNumber;
	}

	public void setTokenNumber(Integer tokenNumber) {
		this.tokenNumber = tokenNumber;
	}

	public LocalDate getQueueDate() {
		return queueDate;
	}

	public void setQueueDate(LocalDate queueDate) {
		this.queueDate = queueDate;
	}

	public Integer getQueuePosition() {
		return queuePosition;
	}

	public void setQueuePosition(Integer queuePosition) {
		this.queuePosition = queuePosition;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCalledAt() {
		return calledAt;
	}

	public void setCalledAt(LocalDateTime calledAt) {
		this.calledAt = calledAt;
	}

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}
	
}
