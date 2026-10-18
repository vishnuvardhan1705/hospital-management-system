package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DoctorRequest;
import com.hospital.management.entity.Doctor;
import com.hospital.management.services.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
	
	private DoctorService doctorService;
	
	public DoctorController(DoctorService doctorService) {
		super();
		this.doctorService = doctorService;
	}

	@GetMapping
	public List<Doctor> alldoctors(){
		List<Doctor> doct = doctorService.findAllDocotrs();
		
		return doct;
	}
	
	@GetMapping("/{id}")
	public Doctor getdoctor(@PathVariable Long id) {
		Doctor doct = doctorService.findById(id);
		
		return doct;
	}
	
	@GetMapping("/hospitals/{hospid}")
	public List<Doctor> doctorByHosp(@PathVariable Long hospid){
		List<Doctor> doct = doctorService.findByHospId(hospid);
		
		return doct;
	}
	
	@GetMapping("/departments/{depid}")
	public List<Doctor> doctorByDep(@PathVariable Long depid){
		List<Doctor> doct = doctorService.findByDeprtId(depid);
		
		return doct;
	}
	
	@PostMapping
	public Doctor createdoctor(@RequestBody DoctorRequest doctor) {
		Doctor doct = doctorService.saveDoctor(doctor);
		
		return doct;
	}
	
	@PutMapping("/{id}")
	public Doctor updateddoctor(@PathVariable Long id, @RequestBody DoctorRequest doctor) {
		Doctor doct = doctorService.updateDocotr(id, doctor);
		
		return doct;
	}
}
