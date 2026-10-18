package com.hospital.management.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity

@Table(name = "surgery_types")
public class SurgeryType {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "surgery_type_id")
    private Long id;

    @Column(name = "surgery_name")
    private String surgeryName;

    @Column(name = "surgery_code")
    private String surgeryCode;

    @Column(name = "description")
    private String description;

    @Column(name = "standard_charge")
    private Double standardCharge;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    @Column(name = "status")
    private String status;

	public Long getSurgeryTypeId() {
		return id;
	}

	public void setSurgeryTypeId(Long id) {
		this.id = id;
	}

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

	public void setStandardCharge(Double double1) {
		this.standardCharge = double1;
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
