package com.hospital.management.dto;

public class OperationTheaterRequest {
	
    private String otName;
    private String location;
    private Integer capacity;
    private String status;
    
	public String getOtName() {
		return otName;
	}
	public void setOtName(String otName) {
		this.otName = otName;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public Integer getCapacity() {
		return capacity;
	}
	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
    
}
