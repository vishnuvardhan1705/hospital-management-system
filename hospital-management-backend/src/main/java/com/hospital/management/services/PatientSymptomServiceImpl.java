package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.PatientSymptomRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.PatientSymptom;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.patientSymptomRepository;

@Service
public class PatientSymptomServiceImpl implements PatientSymptomService {
	
	private patientSymptomRepository patientSymptomRepository;
	private ConsultationRepository consultationRepository;

	public PatientSymptomServiceImpl(
			com.hospital.management.repository.patientSymptomRepository patientSymptomRepository,
			ConsultationRepository consultationRepository) {
		super();
		this.patientSymptomRepository = patientSymptomRepository;
		this.consultationRepository = consultationRepository;
	}

	@Override
	public PatientSymptom addSymptoms(Long consultationId, PatientSymptomRequest request) {

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() ->new RuntimeException("Consultation not found with id : "+ consultationId));

        PatientSymptom symptom = new PatientSymptom();

        symptom.setConsultation(consultation);
        symptom.setSymptomName(request.getSymptomName());
        symptom.setDuration(request.getDuration());
        symptom.setSeverity(request.getSeverity());
        symptom.setDescription(request.getDescription());

        return patientSymptomRepository.save(symptom);
	}

	@Override
	public PatientSymptom getSymptom(Long symptomId) {
		return patientSymptomRepository.findById(symptomId)
				.orElseThrow(() ->new RuntimeException("Symptom not found "));
	}

	@Override
	public List<PatientSymptom> getConsultationSymptom(Long consultationId) {
		return patientSymptomRepository.findByConsultationConsultationId(consultationId);
	}

}
