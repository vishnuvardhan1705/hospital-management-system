package com.hospital.management.dto;

public class BillUpdateRequest {
	
    private String billType;
    private Double discount;
    private Double insuranceAmount;
    
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
