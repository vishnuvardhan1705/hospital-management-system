package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.DoctorScheduleRequest;
import com.hospital.management.entity.DoctorSchedule;

public interface DoctorScheduleService {
	
	public DoctorSchedule saveDoctorSchedule(DoctorScheduleRequest doctorSchedule);
	public DoctorSchedule findById(Long id);
	public List<DoctorSchedule> getDoctorSchedules(Long docId);
	public DoctorSchedule updateDoctorSchedule(Long id, DoctorScheduleRequest doctorSchedule);
	

}
