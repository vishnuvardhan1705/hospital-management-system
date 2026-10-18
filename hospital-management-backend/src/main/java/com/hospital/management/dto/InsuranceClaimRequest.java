package com.hospital.management.dto;

public class InsuranceClaimRequest {

    private Long patientId;
    private Long admissionId;
    private Long billId;
    private Long patientInsuranceId;
    private Double claimedAmount;
    
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
	public Long getBillId() {
		return billId;
	}
	public void setBillId(Long billId) {
		this.billId = billId;
	}
	public Long getPatientInsuranceId() {
		return patientInsuranceId;
	}
	public void setPatientInsuranceId(Long patientInsuranceId) {
		this.patientInsuranceId = patientInsuranceId;
	}
	public Double getClaimedAmount() {
		return claimedAmount;
	}
	public void setClaimedAmount(Double claimedAmount) {
		this.claimedAmount = claimedAmount;
	}
    
    
}
