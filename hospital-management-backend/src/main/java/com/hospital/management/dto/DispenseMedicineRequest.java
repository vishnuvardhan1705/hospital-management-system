package com.hospital.management.dto;

public class DispenseMedicineRequest {
	
    private Long prescriptionItemId;

    private Long batchId;

    private Integer quantity;

    private String dispensedBy;

	public Long getPrescriptionItemId() {
		return prescriptionItemId;
	}

	public void setPrescriptionItemId(Long prescriptionItemId) {
		this.prescriptionItemId = prescriptionItemId;
	}

	public Long getBatchId() {
		return batchId;
	}

	public void setBatchId(Long batchId) {
		this.batchId = batchId;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getDispensedBy() {
		return dispensedBy;
	}

	public void setDispensedBy(String dispensedBy) {
		this.dispensedBy = dispensedBy;
	}

}
