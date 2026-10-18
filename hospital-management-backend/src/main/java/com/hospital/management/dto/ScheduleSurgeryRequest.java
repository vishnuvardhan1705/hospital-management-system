package com.hospital.management.dto;

import java.time.LocalDateTime;

public class ScheduleSurgeryRequest {

    private Long surgeonId;
    private Long otId;
    private LocalDateTime scheduledStart;
    private LocalDateTime scheduledEnd;
    private String anesthesiaType;
    
	public Long getSurgeonId() {
		return surgeonId;
	}
	public void setSurgeonId(Long surgeonId) {
		this.surgeonId = surgeonId;
	}
	public Long getOtId() {
		return otId;
	}
	public void setOtId(Long otId) {
		this.otId = otId;
	}
	public LocalDateTime getScheduledStart() {
		return scheduledStart;
	}
	public void setScheduledStart(LocalDateTime scheduledStart) {
		this.scheduledStart = scheduledStart;
	}
	public LocalDateTime getScheduledEnd() {
		return scheduledEnd;
	}
	public void setScheduledEnd(LocalDateTime scheduledEnd) {
		this.scheduledEnd = scheduledEnd;
	}
	public String getAnesthesiaType() {
		return anesthesiaType;
	}
	public void setAnesthesiaType(String anesthesiaType) {
		this.anesthesiaType = anesthesiaType;
	}
    
}
