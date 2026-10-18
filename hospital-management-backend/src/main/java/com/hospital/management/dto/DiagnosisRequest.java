package com.hospital.management.dto;

public class DiagnosisRequest {
	
	private Long patientId;

    private String diagnosisCode;

    private String diagnosisName;

    private String diagnosisType;

    private String description;

	public Long getPatientId() {
		return patientId;
	}

	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}

	public String getDiagnosisCode() {
		return diagnosisCode;
	}

	public void setDiagnosisCode(String diagnosisCode) {
		this.diagnosisCode = diagnosisCode;
	}

	public String getDiagnosisName() {
		return diagnosisName;
	}

	public void setDiagnosisName(String diagnosisName) {
		this.diagnosisName = diagnosisName;
	}

	public String getDiagnosisType() {
		return diagnosisType;
	}

	public void setDiagnosisType(String diagnosisType) {
		this.diagnosisType = diagnosisType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
