package com.hospital.management.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.Hospital;
import com.hospital.management.services.HospitalService;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {
	
	@Autowired
	private HospitalService hospitalService;
	
	@GetMapping
	public List<Hospital> hospitals(){
		List<Hospital> allhospitals = hospitalService.findAll();
		
		return allhospitals;
	}
	
	@GetMapping("/{id}")
	public Hospital getHospital(@PathVariable("id") Long id ) {
		Hospital hospital = hospitalService.getHospital(id);
		
		return hospital;
	}
	
	@PostMapping
	public Hospital saveHospital(@RequestBody Hospital hospital) {
		Hospital createdhospital = hospitalService.createHospital(hospital);
		
		return createdhospital;
	}

	@PutMapping
	public Hospital updateHospital(@RequestBody Hospital hospital) {
		Hospital updatedhospital = hospitalService.updateHospital(hospital);
		
		return updatedhospital;
	}
	
	@PutMapping("{id}")
	public Hospital updatehospitalbyid(@PathVariable("id") Long id,@RequestBody Hospital hospital) {
		Hospital hosp = hospitalService.getHospital(id);
		
		hosp.setAddress(hospital.getAddress());
		hosp.setCity(hospital.getCity());
		hosp.setCountry(hospital.getCountry());
		hosp.setEmail(hospital.getEmail());
		hosp.setHospitalName(hospital.getHospitalName());
		hosp.setPhone(hospital.getPhone());
		hosp.setPincode(hospital.getPincode());
		hosp.setRegistrationNumber(hospital.getRegistrationNumber());
		
		return hospitalService.updateHospital(hospital);
	}
}
