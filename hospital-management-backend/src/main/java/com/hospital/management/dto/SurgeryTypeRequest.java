package com.hospital.management.dto;

public class SurgeryTypeRequest {

    private String surgeryName;
    private String surgeryCode;
    private String description;
    private Double standardCharge;
    private Integer estimatedDuration;
    private String status;
    
	public String getSurgeryName() {
		return surgeryName;
	}
	public void setSurgeryName(String surgeryName) {
		this.surgeryName = surgeryName;
	}
	public String getSurgeryCode() {
		return surgeryCode;
	}
	public void setSurgeryCode(String surgeryCode) {
		this.surgeryCode = surgeryCode;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Double getStandardCharge() {
		return standardCharge;
	}
	public void setStandardCharge(Double standardCharge) {
		this.standardCharge = standardCharge;
	}
	public Integer getEstimatedDuration() {
		return estimatedDuration;
	}
	public void setEstimatedDuration(Integer estimatedDuration) {
		this.estimatedDuration = estimatedDuration;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
    
}
