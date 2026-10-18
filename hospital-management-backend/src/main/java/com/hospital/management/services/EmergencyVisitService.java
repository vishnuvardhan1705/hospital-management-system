package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.EmergencyVisitRequest;
import com.hospital.management.entity.EmergencyVisit;

public interface EmergencyVisitService {
	
	public EmergencyVisit createEmergencyVisit(EmergencyVisitRequest request);
	public EmergencyVisit getEmergencyVisit(Long visitId);
	public List<EmergencyVisit> getAllEmergencyVisits();
	public List<EmergencyVisit> getPatientEmergencyVisits(Long patientId);
	public EmergencyVisit updateEmergencyVisit(Long visitId, EmergencyVisitRequest request);
	public EmergencyVisit assignDoctor(Long emergencyVisitId,Long doctorId);
	
	EmergencyVisit recordEmergencyTreatment(Long emergencyVisitId);
	EmergencyVisit dischargeEmergencyPatient(Long emergencyVisitId);
	
	EmergencyVisit markEmergencyVisitAdmitted(Long emergencyVisitId);
}
