package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.MedicationAdministrationRequest;
import com.hospital.management.dto.NursingAssignmentRequest;
import com.hospital.management.dto.NursingNotesRequest;
import com.hospital.management.entity.MedicationAdministration;
import com.hospital.management.entity.NursingAssignment;
import com.hospital.management.entity.NursingNote;
import com.hospital.management.services.NursingService;

@RestController
@RequestMapping("/api/nursing")
public class NursingController {

	private NursingService nursingService;

	public NursingController(NursingService nursingService) {
		super();
		this.nursingService = nursingService;
	}
	
	@PostMapping("/assignments")
	public NursingAssignment assignPatient(@RequestBody NursingAssignmentRequest request) {
		
		return nursingService.assignPatient(request);
	}
	
	@GetMapping("/assignments/{nurseId}")
	public List<NursingAssignment> getAssignedPatients(@PathVariable Long nurseId) {
		
		return nursingService.getAssignedPatients(nurseId);
	}
	
	@PostMapping("/notes")
	public NursingNote addnotes(@RequestBody NursingNotesRequest request) {
		
		return nursingService.addNursingNote(request);
	}
	
	@PutMapping("/notes/{nursingNoteId}")
	public NursingNote updateNotes(@PathVariable Long nursingNoteId, @RequestBody NursingNotesRequest request) {
		
		return nursingService.updateNotes(nursingNoteId, request);
	}
	
	@PostMapping("/medications")
	public MedicationAdministration administerMedication(@RequestBody MedicationAdministrationRequest request) {
		
		return nursingService.administerMedication(request);
	}
	
    @GetMapping("/history/patient/{patientId}")
    public List<NursingNote> getPatientNursingNotes(@PathVariable Long patientId) {

        return nursingService.getPatientNursingNotes(patientId);
    }

    @GetMapping("/medications/patient/{patientId}")
    public List<MedicationAdministration>getPatientMedicationHistory(@PathVariable Long patientId) {

        return nursingService.getPatientMedicationHistory(patientId);
    }
	
}
