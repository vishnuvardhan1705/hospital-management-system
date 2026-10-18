package com.hospital.management.dto;

public class PatientVitalRequest {
	
	 private Long patientId;
	 private Long visitId;
	 private Double temperature;
	 private Integer pulse;
	 private Integer systolicBp;
	 private Integer diastolicBp;
	 private Double oxygenSaturation;
	 private Double weight;
	 private Double height;
	 private Integer respiratoryRate;
	 private String recordedBy;
	 
	 public Long getPatientId() {
		 return patientId;
	 }
	 public void setPatientId(Long patientId) {
		 this.patientId = patientId;
	 }
	 public Long getVisitId() {
		 return visitId;
	 }
	 public void setVisitId(Long visitId) {
		 this.visitId = visitId;
	 }
	 public Double getTemperature() {
		 return temperature;
	 }
	 public void setTemperature(Double temperature) {
		 this.temperature = temperature;
	 }
	 public Integer getPulse() {
		 return pulse;
	 }
	 public void setPulse(Integer pulse) {
		 this.pulse = pulse;
	 }
	 public Integer getSystolicBp() {
		 return systolicBp;
	 }
	 public void setSystolicBp(Integer systolicBp) {
		 this.systolicBp = systolicBp;
	 }
	 public Integer getDiastolicBp() {
		 return diastolicBp;
	 }
	 public void setDiastolicBp(Integer diastolicBp) {
		 this.diastolicBp = diastolicBp;
	 }
	 public Double getOxygenSaturation() {
		 return oxygenSaturation;
	 }
	 public void setOxygenSaturation(Double oxygenSaturation) {
		 this.oxygenSaturation = oxygenSaturation;
	 }
	 public Double getWeight() {
		 return weight;
	 }
	 public void setWeight(Double weight) {
		 this.weight = weight;
	 }
	 public Double getHeight() {
		 return height;
	 }
	 public void setHeight(Double height) {
		 this.height = height;
	 }
	 public Integer getRespiratoryRate() {
		 return respiratoryRate;
	 }
	 public void setRespiratoryRate(Integer respiratoryRate) {
		 this.respiratoryRate = respiratoryRate;
	 }
	 public String getRecordedBy() {
		 return recordedBy;
	 }
	 public void setRecordedBy(String recordedBy) {
		 this.recordedBy = recordedBy;
	 }

}
