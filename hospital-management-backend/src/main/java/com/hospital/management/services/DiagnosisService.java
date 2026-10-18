package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.DiagnosisRequest;
import com.hospital.management.entity.Diagnosis;

public interface DiagnosisService {
	
	public Diagnosis addDiagnosis(Long consultationId,DiagnosisRequest request);
	public Diagnosis getDiagnosis(Long diagnosisId);
	public List<Diagnosis> getPatientDiagnosis(Long patientId);
	public List<Diagnosis> getConsutationDiagnosis(Long consultationId);

}
