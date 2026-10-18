package com.hospital.management.dto;

public class LabResultRequest {
    private Long orderItemId;
    private Long testId;
    private String resultValue;
    private String unit;
    private String referenceRange;
    private String abnormalFlag;
    private String remarks;
    private String enteredBy;
	public Long getOrderItemId() {
		return orderItemId;
	}
	public void setOrderItemId(Long orderItemId) {
		this.orderItemId = orderItemId;
	}
	public Long getTestId() {
		return testId;
	}
	public void setTestId(Long testId) {
		this.testId = testId;
	}
	public String getResultValue() {
		return resultValue;
	}
	public void setResultValue(String resultValue) {
		this.resultValue = resultValue;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getReferenceRange() {
		return referenceRange;
	}
	public void setReferenceRange(String referenceRange) {
		this.referenceRange = referenceRange;
	}
	public String getAbnormalFlag() {
		return abnormalFlag;
	}
	public void setAbnormalFlag(String abnormalFlag) {
		this.abnormalFlag = abnormalFlag;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getEnteredBy() {
		return enteredBy;
	}
	public void setEnteredBy(String enteredBy) {
		this.enteredBy = enteredBy;
	}

}
