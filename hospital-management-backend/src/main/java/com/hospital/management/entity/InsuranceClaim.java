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
@Table(name = "insurance_claims")
public class InsuranceClaim {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id")
    private Admission admission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_insurance_id", nullable = false)
    private PatientInsurance patientInsurance;

    @Column(name = "claim_number", unique = true)
    private String claimNumber;

    @Column(name = "claimed_amount", nullable = false)
    private Double claimedAmount;

    @Column(name = "approved_amount")
    private Double approvedAmount;

    @Column(name = "rejected_amount")
    private Double rejectedAmount;

    @Column(name = "submitted_date")
    private LocalDateTime submittedDate;

    @Column(name = "settlement_date")
    private LocalDateTime settlementDate;

    private String status;

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

	public Admission getAdmission() {
		return admission;
	}

	public void setAdmission(Admission admission) {
		this.admission = admission;
	}

	public Bill getBill() {
		return bill;
	}

	public void setBill(Bill bill) {
		this.bill = bill;
	}

	public PatientInsurance getPatientInsurance() {
		return patientInsurance;
	}

	public void setPatientInsurance(PatientInsurance patientInsurance) {
		this.patientInsurance = patientInsurance;
	}

	public String getClaimNumber() {
		return claimNumber;
	}

	public void setClaimNumber(String claimNumber) {
		this.claimNumber = claimNumber;
	}

	public Double getClaimedAmount() {
		return claimedAmount;
	}

	public void setClaimedAmount(Double claimedAmount) {
		this.claimedAmount = claimedAmount;
	}

	public Double getApprovedAmount() {
		return approvedAmount;
	}

	public void setApprovedAmount(Double approvedAmount) {
		this.approvedAmount = approvedAmount;
	}

	public Double getRejectedAmount() {
		return rejectedAmount;
	}

	public void setRejectedAmount(Double rejectedAmount) {
		this.rejectedAmount = rejectedAmount;
	}

	public LocalDateTime getSubmittedDate() {
		return submittedDate;
	}

	public void setSubmittedDate(LocalDateTime submittedDate) {
		this.submittedDate = submittedDate;
	}

	public LocalDateTime getSettlementDate() {
		return settlementDate;
	}

	public void setSettlementDate(LocalDateTime settlementDate) {
		this.settlementDate = settlementDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
