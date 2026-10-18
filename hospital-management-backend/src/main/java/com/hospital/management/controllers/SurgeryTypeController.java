package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.SurgeryTypeRequest;
import com.hospital.management.entity.SurgeryType;
import com.hospital.management.services.SurgeryService;

@RestController
@RequestMapping("/api/surgery-types")
public class SurgeryTypeController {
	
	private SurgeryService surgeryService;

	public SurgeryTypeController(SurgeryService surgeryService) {
		super();
		this.surgeryService = surgeryService;
	}
	
	@PostMapping
	public SurgeryType createSurgeryType(@RequestBody SurgeryTypeRequest request) {
		
		return surgeryService.createSurgeryType(request);
	}
	
	@GetMapping
	public List<SurgeryType> getAllSurgerytypes(){
		
		return surgeryService.getAllSurgeryType();
	}

}
