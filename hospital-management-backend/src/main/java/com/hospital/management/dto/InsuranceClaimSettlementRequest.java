package com.hospital.management.dto;

public class InsuranceClaimSettlementRequest {

    private Double approvedAmount;
    private Double rejectedAmount;
    
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
    
}
