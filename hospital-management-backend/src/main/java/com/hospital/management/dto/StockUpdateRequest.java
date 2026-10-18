package com.hospital.management.dto;

public class StockUpdateRequest {
	
    private Integer quantity;

    private String operation;

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}
    
}
