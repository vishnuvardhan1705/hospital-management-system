package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.OperationTheaterRequest;
import com.hospital.management.entity.OperationTheaters;
import com.hospital.management.services.SurgeryService;

@RestController
@RequestMapping("/api/operation-theatres")
public class OperationTheatreController {
	
	private SurgeryService surgeryService;

	public OperationTheatreController(SurgeryService surgeryService) {
		super();
		this.surgeryService = surgeryService;
	}
	
	@PostMapping
	public OperationTheaters createTheatre(@RequestBody OperationTheaterRequest request) {
		
		return surgeryService.createOperationTheatre(request);
	}
	
	@GetMapping
	public List<OperationTheaters> getAllTheaters(){
		
		return surgeryService.getAllOperationTheaters();
	}

}
