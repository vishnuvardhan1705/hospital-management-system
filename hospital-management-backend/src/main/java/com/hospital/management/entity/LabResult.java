package com.hospital.management.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lab_results")
public class LabResult {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    private LabOrderItems orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private LabTest test;

    @Column(name = "result_value")
    private String resultValue;

    @Column(name = "unit")
    private String unit;

    @Column(name = "reference_range")
    private String referenceRange;

    @Column(name = "abnormal_flag")
    private String abnormalFlag;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "entered_by")
    private String enteredBy;

    @Column(name = "verified_by")
    private String verifiedBy;

    @Column(name = "result_date")
    private LocalDateTime resultDate;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LabOrderItems getOrderItem() {
		return orderItem;
	}

	public void setOrderItem(LabOrderItems orderItem) {
		this.orderItem = orderItem;
	}

	public LabTest getTest() {
		return test;
	}

	public void setTest(LabTest test) {
		this.test = test;
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

	public String getVerifiedBy() {
		return verifiedBy;
	}

	public void setVerifiedBy(String verifiedBy) {
		this.verifiedBy = verifiedBy;
	}

	public LocalDateTime getResultDate() {
		return resultDate;
	}

	public void setResultDate(LocalDateTime resultDate) {
		this.resultDate = resultDate;
	}

}
