package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.CompleteSurgeryRequest;
import com.hospital.management.dto.ScheduleSurgeryRequest;
import com.hospital.management.dto.SurgeryRequestDto;
import com.hospital.management.entity.Surgery;
import com.hospital.management.entity.SurgeryRequest;
import com.hospital.management.services.SurgeryService;

@RestController
@RequestMapping("/api/surgeries")
public class SurgeryController {
	
	private SurgeryService surgeryService;

	public SurgeryController(SurgeryService surgeryService) {
		super();
		this.surgeryService = surgeryService;
	}
	
	@PostMapping("/requests")
	public SurgeryRequest createRequest(@RequestBody SurgeryRequestDto request) {
		
		return surgeryService.createSurgeryRequest(request);
	}
	
	@GetMapping("/requests/{requestId}")
	public SurgeryRequest getSurgeryRequest(@PathVariable Long requestId) {
		
		return surgeryService.getSurgeryRequest(requestId);
	}
	
    @PostMapping("/{id}/approve")
    public SurgeryRequest approveSurgery(
            @PathVariable Long id) {
        return surgeryService.approveSurgery(id);
    }

    
    @PostMapping("/{id}/schedule")
    public Surgery scheduleSurgery(@PathVariable Long id, @RequestBody ScheduleSurgeryRequest request) {
    	
        return surgeryService.scheduleSurgery(id, request);
    }

    @PostMapping("/{id}/start")
    public Surgery startSurgery(@PathVariable Long id) {
    	
        return surgeryService.startSurgery(id);
    }


    @PostMapping("/{id}/complete")
    public Surgery completeSurgery(@PathVariable Long id,@RequestBody CompleteSurgeryRequest request) {
    	
        return surgeryService.completeSurgery(id, request);
    }

    @PostMapping("/{id}/cancel")
    public Surgery cancelSurgery(@PathVariable Long id) {
    	
        return surgeryService.cancelSurgery(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<Surgery> getPatientSurgeries( @PathVariable Long patientId) {
    	
        return surgeryService.getSurgeriesByPatient(patientId);
    }

    @GetMapping("/status/{status}")
    public List<Surgery> getSurgeriesByStatus(@PathVariable String status) {
    	
        return surgeryService.getSurgeryByStatus(status);
    }

}
