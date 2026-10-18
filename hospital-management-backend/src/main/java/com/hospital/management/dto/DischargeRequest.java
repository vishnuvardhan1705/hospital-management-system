package com.hospital.management.dto;

public class DischargeRequest {

    private Long admissionId;
    private Long patientId;
    private Long doctorId;
    private String dischargeType;
    private String finalDiagnosis;
    private String treatmentSummary;
    private String conditionAtDischarge;
    private String instructions;
    
	public Long getAdmissionId() {
		return admissionId;
	}
	public void setAdmissionId(Long admissionId) {
		this.admissionId = admissionId;
	}
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
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
    
}
