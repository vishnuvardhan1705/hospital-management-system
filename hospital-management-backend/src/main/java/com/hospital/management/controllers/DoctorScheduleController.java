package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DoctorScheduleRequest;
import com.hospital.management.entity.DoctorSchedule;
import com.hospital.management.repository.DoctorScheduleRepository;
import com.hospital.management.services.DoctorScheduleService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorScheduleController {
	
	private DoctorScheduleService doctorScheduleService;

	public DoctorScheduleController(DoctorScheduleService doctorScheduleService) {
		this.doctorScheduleService = doctorScheduleService;
	}
	
	@GetMapping("/{docid}/schedule")
	public List<DoctorSchedule> findallDoctorSchedules(@PathVariable Long docid){
		List<DoctorSchedule> docShedule = doctorScheduleService.getDoctorSchedules(docid);
		
		return docShedule;
	}
	
	@GetMapping("/schedule/{id}")
	public DoctorSchedule doctorShedulebyDocId(@PathVariable Long id){
		DoctorSchedule docShedule = doctorScheduleService.findById(id);
		
		return docShedule;
	}
	
	@PostMapping("/{docid}/schedule")
	public DoctorSchedule createDocSchedule(@PathVariable Long docid ,@RequestBody DoctorScheduleRequest doctorScheduleRequest) {
		
		doctorScheduleRequest.setDoctorId(docid);
		DoctorSchedule docSchedule = doctorScheduleService.saveDoctorSchedule(doctorScheduleRequest);
		
		return docSchedule;
	}

	@PutMapping("/schedule/{id}")
	public DoctorSchedule updateDocSchedule(@PathVariable Long id, @RequestBody DoctorScheduleRequest doctorScheduleRequest) {
		DoctorSchedule docSchedule = doctorScheduleService.updateDoctorSchedule(id, doctorScheduleRequest);
		
		return docSchedule;
		
	}
}
