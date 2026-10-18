package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.PatientSymptomRequest;
import com.hospital.management.entity.PatientSymptom;

public interface PatientSymptomService {
	
	public PatientSymptom addSymptoms(Long consultationId,PatientSymptomRequest request);
	public PatientSymptom getSymptom(Long symptomId);
	public List<PatientSymptom> getConsultationSymptom(Long consultationId);

}
