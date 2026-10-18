package com.hospital.management.dto;

public class BillRequest {
	
    private Long patientId;
    private Long visitId;
    private Long admissionId;
    private String billType;
    private Double discount;
    private Double insuranceAmount;
    
	public Long getPatientId() {
		return patientId;
	}
	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}
	public Long getVisitId() {
		return visitId;
	}
	public void setVisitId(Long visitId) {
		this.visitId = visitId;
	}
	public Long getAdmissionId() {
		return admissionId;
	}
	public void setAdmissionId(Long admissionId) {
		this.admissionId = admissionId;
	}
	public String getBillType() {
		return billType;
	}
	public void setBillType(String billType) {
		this.billType = billType;
	}
	public Double getDiscount() {
		return discount;
	}
	public void setDiscount(Double discount) {
		this.discount = discount;
	}
	public Double getInsuranceAmount() {
		return insuranceAmount;
	}
	public void setInsuranceAmount(Double insuranceAmount) {
		this.insuranceAmount = insuranceAmount;
	}
    

}
