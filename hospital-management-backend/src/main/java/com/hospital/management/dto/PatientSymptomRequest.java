package com.hospital.management.dto;

public class PatientSymptomRequest {
	
	private String symptomName;
    private String duration;
    private String severity;
    private String description;
    
	public String getSymptomName() {
		return symptomName;
	}
	public void setSymptomName(String symptomName) {
		this.symptomName = symptomName;
	}
	public String getDuration() {
		return duration;
	}
	public void setDuration(String duration) {
		this.duration = duration;
	}
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
    
    

}
