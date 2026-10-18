package com.hospital.management.dto;

public class LabSampleRequest {

    private Long patientId;

    private Long labOrderId;

    private String sampleType;

    private String barcode;

    private String collectedBy;

    private String status;

	public Long getPatientId() {
		return patientId;
	}

	public void setPatientId(Long patientId) {
		this.patientId = patientId;
	}

	public Long getLabOrderId() {
		return labOrderId;
	}

	public void setLabOrderId(Long labOrderId) {
		this.labOrderId = labOrderId;
	}

	public String getSampleType() {
		return sampleType;
	}

	public void setSampleType(String sampleType) {
		this.sampleType = sampleType;
	}

	public String getBarcode() {
		return barcode;
	}

	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}

	public String getCollectedBy() {
		return collectedBy;
	}

	public void setCollectedBy(String collectedBy) {
		this.collectedBy = collectedBy;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
    
}
