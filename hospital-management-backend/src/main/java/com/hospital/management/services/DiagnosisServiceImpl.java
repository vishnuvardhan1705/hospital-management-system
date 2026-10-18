package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.DiagnosisRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Diagnosis;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.DiagnosisRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class DiagnosisServiceImpl implements DiagnosisService {
	
	private DiagnosisRepository diagnosisRepository;
	private PatientRepository patientRepository;
	private ConsultationRepository consultationRepository;
	
	public DiagnosisServiceImpl(DiagnosisRepository diagnosisRepository, PatientRepository patientRepository,
			ConsultationRepository consultationRepository) {
		this.diagnosisRepository = diagnosisRepository;
		this.patientRepository = patientRepository;
		this.consultationRepository = consultationRepository;
	}

	@Override
	public Diagnosis addDiagnosis(Long consultationId, DiagnosisRequest request) {
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(()->
									new RuntimeException("Patient not found"));
		
		Consultation consultation = consultationRepository.findById(consultationId).orElseThrow(()->
											new RuntimeException("Consultation not found"));
		
		if (consultation.getPatient() == null
		        || !consultation.getPatient().getId().equals(patient.getId())) {
		    throw new IllegalArgumentException(
		            "Patient does not match the consultation");
		}
		
		Diagnosis diagnosis = new Diagnosis();
		
		diagnosis.setPatient(patient);
		diagnosis.setConsultation(consultation);
		
		diagnosis.setDescription(request.getDescription());
		diagnosis.setDiagnosisCode(request.getDiagnosisCode());
		diagnosis.setDiagnosisName(request.getDiagnosisName());
		diagnosis.setDiagnosisType(request.getDiagnosisType());
		diagnosis.setDiagnosedAt(LocalDateTime.now());
		
		return diagnosisRepository.save(diagnosis);
	}

	@Override
	public Diagnosis getDiagnosis(Long diagnosisId) {
		return diagnosisRepository.findById(diagnosisId).orElseThrow(()->
						new RuntimeException("Diagnosis not found"));
	}

	@Override
	public List<Diagnosis> getPatientDiagnosis(Long patientId) {
		return diagnosisRepository.findByPatientId(patientId);
	}

	@Override
	public List<Diagnosis> getConsutationDiagnosis(Long consultationId) {
		return diagnosisRepository.findByConsultationConsultationId(consultationId);
	}

}
