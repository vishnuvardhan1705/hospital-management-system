package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AdmissionRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.services.AdmissionService;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

	private AdmissionService admissionService;

	public AdmissionController(AdmissionService admissionService) {
		super();
		this.admissionService = admissionService;
	}

    @PostMapping
    public Admission createAdmission(@RequestBody AdmissionRequest request) {

        return admissionService.createAdmission(request);
    }

    @GetMapping("/{admissionId}")
    public Admission getAdmission(@PathVariable Long admissionId) {

        return admissionService.getAdmission(admissionId);
    }

    @PutMapping("/{admissionId}")
    public Admission updateAdmission(@PathVariable Long admissionId,@RequestBody AdmissionRequest request) {

        return admissionService.updateAdmission(admissionId,request);
    }

    @PostMapping("/{admissionId}/approve")
    public Admission approveAdmission(@PathVariable Long admissionId) {

        return admissionService.approveAdmission(admissionId);
    }

    @GetMapping("/active")
    public List<Admission> getActiveAdmissions() {

        return admissionService.getActiveAdmissions();
    }

    @GetMapping("/patient/{patientId}")
    public List<Admission> getPatientAdmissionHistory(@PathVariable Long patientId) {

        return admissionService.getAdmissionByPatient(patientId);
    }

    @PatchMapping("/{admissionId}/doctor/{doctorId}")
    public Admission assignDoctor(@PathVariable Long admissionId,@PathVariable Long doctorId) {

        return admissionService.assignDoctor(admissionId,doctorId);
    }

    @PatchMapping("/{admissionId}/ward/{wardId}")
    public Admission assignWard( @PathVariable Long admissionId,@PathVariable Long wardId) {

        return admissionService.assignWard(admissionId,wardId);
    }
}

