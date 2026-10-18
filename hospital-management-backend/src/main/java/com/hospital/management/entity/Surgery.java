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
@Table(name = "surgeries")
public class Surgery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "surgery_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surgery_request_id", nullable = false)
    private SurgeryRequest surgeryRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surgeon_id", nullable = false)
    private Doctor surgeon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ot_id", nullable = false)
    private OperationTheaters operationTheatre;

    @Column(name = "scheduled_start")
    private LocalDateTime scheduledStart;

    @Column(name = "scheduled_end")
    private LocalDateTime scheduledEnd;

    @Column(name = "actual_start")
    private LocalDateTime actualStart;

    @Column(name = "actual_end")
    private LocalDateTime actualEnd;

    @Column(name = "anesthesia_type")
    private String anesthesiaType;

    @Column(name = "outcome")
    private String outcome;

    @Column(name = "status")
    private String status;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public SurgeryRequest getSurgeryRequest() {
		return surgeryRequest;
	}

	public void setSurgeryRequest(SurgeryRequest surgeryRequest) {
		this.surgeryRequest = surgeryRequest;
	}

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public Doctor getSurgeon() {
		return surgeon;
	}

	public void setSurgeon(Doctor surgeon) {
		this.surgeon = surgeon;
	}

	public OperationTheaters getOperationTheatre() {
		return operationTheatre;
	}

	public void setOperationTheatre(OperationTheaters operationTheatre) {
		this.operationTheatre = operationTheatre;
	}

	public LocalDateTime getScheduledStart() {
		return scheduledStart;
	}

	public void setScheduledStart(LocalDateTime scheduledStart) {
		this.scheduledStart = scheduledStart;
	}

	public LocalDateTime getScheduledEnd() {
		return scheduledEnd;
	}

	public void setScheduledEnd(LocalDateTime scheduledEnd) {
		this.scheduledEnd = scheduledEnd;
	}

	public LocalDateTime getActualStart() {
		return actualStart;
	}

	public void setActualStart(LocalDateTime actualStart) {
		this.actualStart = actualStart;
	}

	public LocalDateTime getActualEnd() {
		return actualEnd;
	}

	public void setActualEnd(LocalDateTime actualEnd) {
		this.actualEnd = actualEnd;
	}

	public String getAnesthesiaType() {
		return anesthesiaType;
	}

	public void setAnesthesiaType(String anesthesiaType) {
		this.anesthesiaType = anesthesiaType;
	}

	public String getOutcome() {
		return outcome;
	}

	public void setOutcome(String outcome) {
		this.outcome = outcome;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    
}
