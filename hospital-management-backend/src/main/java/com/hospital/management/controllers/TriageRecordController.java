package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.TriageRecordRequest;
import com.hospital.management.entity.TriageRecord;
import com.hospital.management.services.TriageRecordService;

@RestController
@RequestMapping("/api/triage-records")
public class TriageRecordController {

	private TriageRecordService recordService;

	public TriageRecordController(TriageRecordService recordService) {
		super();
		this.recordService = recordService;
	}
	
	@PostMapping
	public TriageRecord createRecord(@RequestBody TriageRecordRequest request) {
		
		return recordService.recordTriage(request);
	}
	
	@GetMapping("/{triageId}")
	public TriageRecord getTriagerecord(@PathVariable Long triageId) {
		
		return recordService.getTriageRecord(triageId);
	}
	
    @GetMapping("/emergency-visit/{emergencyVisitId}")
    public List<TriageRecord> getTriageByEmergencyVisit(@PathVariable Long emergencyVisitId) {

        return recordService.getTriageByEmergencyVisit(emergencyVisitId);
    }

    @GetMapping("/patient/{patientId}")
    public List<TriageRecord> getPatientTriageHistory(@PathVariable Long patientId) {

        return recordService.getPatientTriageHistory(patientId);
    }
}

