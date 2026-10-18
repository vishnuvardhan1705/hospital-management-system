package com.hospital.management.dto;

public class MedicationAdministrationRequest {

    private Long patientId;
    private Long admissionId;
    private Long prescriptionItemId;
    private Long medicineId;
    private Long administeredBy;
    private String dosage;
    private String status;
    private String remarks;
    
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getAdmissionId() {
		return admissionId;
	}
	public void setAdmissionId(Long admissionId) {
		this.admissionId = admissionId;
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
