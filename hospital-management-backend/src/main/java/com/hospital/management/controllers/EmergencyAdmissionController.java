package com.hospital.management.controllers;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AdmissionRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.EmergencyVisit;
import com.hospital.management.services.AdmissionService;
import com.hospital.management.services.EmergencyVisitService;

@RestController
public class EmergencyAdmissionController {
    private final AdmissionService admissionService;
    private final EmergencyVisitService emergencyVisitService;

    public EmergencyAdmissionController(
            AdmissionService admissionService,
            EmergencyVisitService emergencyVisitService) {

        this.admissionService = admissionService;
        this.emergencyVisitService = emergencyVisitService;
    }

    @PostMapping("/api/emergency/{emergencyVisitId}/admit")
    public Admission admitEmergencyPatient(@PathVariable Long emergencyVisitId,@RequestBody AdmissionRequest request) {

        EmergencyVisit emergencyVisit = emergencyVisitService.getEmergencyVisit(emergencyVisitId);

       
        request.setPatientId(emergencyVisit.getPatient().getId());

        Admission admission = admissionService.createAdmission(request);

        emergencyVisit.setStatus("ADMITTED");

        return admission;
    }

}
