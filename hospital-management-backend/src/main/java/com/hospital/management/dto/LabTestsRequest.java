package com.hospital.management.dto;

public class LabTestsRequest {
	
    private String testCode;
    private String testName;
    private String category;
    private String description;
    private Double price;
    private String normalRange;
    private String status;
    
	public String getTestCode() {
		return testCode;
	}
	public void setTestCode(String testCode) {
		this.testCode = testCode;
	}
	public String getTestName() {
		return testName;
	}
	public void setTestName(String testName) {
		this.testName = testName;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public String getNormalRange() {
		return normalRange;
	}
	public void setNormalRange(String normalRange) {
		this.normalRange = normalRange;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

}
