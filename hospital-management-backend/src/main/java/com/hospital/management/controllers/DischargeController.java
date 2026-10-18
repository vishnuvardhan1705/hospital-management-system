package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DischargeMedicationRequest;
import com.hospital.management.dto.DischargeRequest;
import com.hospital.management.entity.Discharge;
import com.hospital.management.entity.DischargeMedication;
import com.hospital.management.services.DischargeService;

@RestController
@RequestMapping("/api/discharges")
public class DischargeController {

	private DischargeService dischargeService;

	public DischargeController(DischargeService dischargeService) {
		super();
		this.dischargeService = dischargeService;
	}
	
	@PostMapping
	public Discharge createDischarge(@RequestBody DischargeRequest request) {
		
		return dischargeService.createDischarge(request);
	}
	
	@GetMapping("/{dischargeId}")
	public Discharge getDischarge(@PathVariable Long dischargeId) {
		
		return dischargeService.getDischarge(dischargeId);
	}
	
	@GetMapping("/patient/{patientId}")
	public List<Discharge> getDischargeBypatient(@PathVariable Long patientId){
		
		return dischargeService.getDischargeByPatient(patientId);
	}
	
	@PostMapping("/{dischargeId}/medications")
	public DischargeMedication addmedication(@PathVariable Long dischargeId, @RequestBody DischargeMedicationRequest request) {
		
		return dischargeService.addDischargeMedication(dischargeId, request);
	}
	
	@GetMapping("/{dischargeId}/medications")
	public List<DischargeMedication> getdischargeMedication(@PathVariable Long dischargeId){
		
		return dischargeService.getDischargeMedication(dischargeId);
	}
	
	@PostMapping("/{dischargeId}/complete")
	public Discharge completedischarge(@PathVariable Long dischargeId) {
		
		return dischargeService.completeDischarge(dischargeId);
	}
}
