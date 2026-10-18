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
@Table(name = "medication_administrations")
public class MedicationAdministration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "administration_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id", nullable = false)
    private Admission admission;

    @Column(name = "prescription_item_id")
    private Long prescriptionItemId;

    @Column(name = "medicine_id")
    private Long medicineId;

    @Column(name = "administered_by")
    private Long administeredBy;

    @Column(name = "administered_at")
    private LocalDateTime administeredAt;

    @Column(name = "dosage")
    private String dosage;

    @Column(name = "status")
    private String status;

    @Column(name = "remarks")
    private String remarks;

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

	public Long getPrescriptionItemId() {
		return prescriptionItemId;
	}

	public void setPrescriptionItemId(Long prescriptionItemId) {
		this.prescriptionItemId = prescriptionItemId;
	}

	public Long getMedicineId() {
		return medicineId;
	}

	public void setMedicineId(Long medicineId) {
		this.medicineId = medicineId;
	}

	public Long getAdministeredBy() {
		return administeredBy;
	}

	public void setAdministeredBy(Long administeredBy) {
		this.administeredBy = administeredBy;
	}

	public LocalDateTime getAdministeredAt() {
		return administeredAt;
	}

	public void setAdministeredAt(LocalDateTime administeredAt) {
		this.administeredAt = administeredAt;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
   

}
