package com.hospital.management.dto;

import java.time.LocalTime;

public class DoctorScheduleRequest {
	private Long doctorId;

    private String dayOfWeek;

    private LocalTime startTime;

    private LocalTime endTime;

    private LocalTime breakStart;

    private LocalTime breakEnd;

    private String status;

	public Long getDoctorId() {
		return doctorId;
	}

	public void setDoctorId(Long doctorId) {
		this.doctorId = doctorId;
	}

	public String getDayOfWeek() {
		return dayOfWeek;
	}

	public void setDayOfWeek(String dayOfWeek) {
		this.dayOfWeek = dayOfWeek;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalTime startTime) {
		this.startTime = startTime;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalTime endTime) {
		this.endTime = endTime;
	}

	public LocalTime getBreakStart() {
		return breakStart;
	}

	public void setBreakStart(LocalTime breakStart) {
		this.breakStart = breakStart;
	}

	public LocalTime getBreakEnd() {
		return breakEnd;
	}

	public void setBreakEnd(LocalTime breakEnd) {
		this.breakEnd = breakEnd;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
