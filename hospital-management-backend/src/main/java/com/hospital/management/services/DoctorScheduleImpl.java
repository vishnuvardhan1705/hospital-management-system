package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;
import com.hospital.management.dto.DoctorScheduleRequest;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.DoctorSchedule;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.DoctorScheduleRepository;

@Service
public class DoctorScheduleImpl implements DoctorScheduleService {
	
	private DoctorScheduleRepository doctorScheduleRepository;
	private DoctorRepository doctorRepository;

	public DoctorScheduleImpl(DoctorScheduleRepository doctorScheduleRepository, DoctorRepository doctorRepository) {
		this.doctorScheduleRepository = doctorScheduleRepository;
		this.doctorRepository = doctorRepository;
	}

	@Override
	public DoctorSchedule saveDoctorSchedule(DoctorScheduleRequest doctorSchedule) {
		Doctor doctor = doctorRepository.findById(doctorSchedule.getDoctorId()).orElseThrow(()->
												new RuntimeException("Doctor not found with id : "+doctorSchedule.getDoctorId()));
		
		DoctorSchedule docshedule = new DoctorSchedule();
		docshedule.setDoctor(doctor);
		
		docshedule.setBreakEnd(doctorSchedule.getBreakEnd());
		docshedule.setBreakStart(doctorSchedule.getBreakStart());
		docshedule.setDayOfWeek(doctorSchedule.getDayOfWeek());
		docshedule.setEndTime(doctorSchedule.getEndTime());
		docshedule.setStartTime(doctorSchedule.getStartTime());
		docshedule.setStatus(doctorSchedule.getStatus());
		
		return doctorScheduleRepository.save(docshedule);
	}


	@Override
	public DoctorSchedule findById(Long id) {
		return doctorScheduleRepository.findById(id).orElseThrow(()->
											new RuntimeException("DoctorShedule not found with id : "+id));
	}

	@Override
	public List<DoctorSchedule> getDoctorSchedules(Long docId) {
		return doctorScheduleRepository.findByDoctorId(docId);
	}

	@Override
	public DoctorSchedule updateDoctorSchedule(Long id, DoctorScheduleRequest doctorSchedule) {
		DoctorSchedule docshedule = doctorScheduleRepository.findById(id).orElseThrow(()->
										new RuntimeException("DoctorShedule not found with id : "+id));
		
		if(doctorSchedule.getDoctorId() != null) {
			Doctor doctor = doctorRepository.findById(doctorSchedule.getDoctorId()).orElseThrow(()->
									new RuntimeException("Doctor not found with id : "+doctorSchedule.getDoctorId()));
			
			docshedule.setDoctor(doctor);
		}
		
		docshedule.setBreakEnd(doctorSchedule.getBreakEnd());
		docshedule.setBreakStart(doctorSchedule.getBreakStart());
		docshedule.setDayOfWeek(doctorSchedule.getDayOfWeek());
		docshedule.setEndTime(doctorSchedule.getEndTime());
		docshedule.setStartTime(doctorSchedule.getStartTime());
		docshedule.setStatus(doctorSchedule.getStatus());
		
		return doctorScheduleRepository.save(docshedule);
		
	}

}
