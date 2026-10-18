package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.PatientVitalRequest;
import com.hospital.management.entity.PatientVital;

public interface PatientVitalService {
	
	 public PatientVital recordVital(Long consultationId, PatientVitalRequest request);

	 public PatientVital getVital(Long vitalId);

	 public List<PatientVital> getPatientVitals(Long patientId);

	 public List<PatientVital> getConsultationVitals(Long consultationId);

}
