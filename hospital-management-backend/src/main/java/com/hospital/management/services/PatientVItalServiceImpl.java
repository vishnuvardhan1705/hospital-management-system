package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.PatientVitalRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PatientVisit;
import com.hospital.management.entity.PatientVital;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PatientVisitRepository;
import com.hospital.management.repository.PatientVitalRepository;

@Service
public class PatientVItalServiceImpl implements PatientVitalService {
	
	private PatientVitalRepository patientVitalRepository;
	private PatientRepository patientRepository;
	private ConsultationRepository consultationRepository;
	private PatientVisitRepository patientVisitRepository;

	public PatientVItalServiceImpl(PatientVitalRepository patientVitalRepository, PatientRepository patientRepository,
			ConsultationRepository consultationRepository, PatientVisitRepository patientVisitRepository) {
		this.patientVitalRepository = patientVitalRepository;
		this.patientRepository = patientRepository;
		this.consultationRepository = consultationRepository;
		this.patientVisitRepository = patientVisitRepository;
	}

	@Override
	public PatientVital recordVital(Long consultationId, PatientVitalRequest request) {
        Consultation consultation =consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));

        Patient patient =patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->new RuntimeException("Patient not found"));

        PatientVisit visit =patientVisitRepository.findById(request.getVisitId())
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (visit.getPatient() == null
                || !visit.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the visit");
        }

        if (consultation.getPatient() == null
                || !consultation.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the consultation");
        }

        if (consultation.getVisit() == null
                || !consultation.getVisit().getId().equals(visit.getId())) {
            throw new IllegalArgumentException(
                    "Visit does not match the consultation");
        }
        
        PatientVital vital = new PatientVital();

        vital.setPatient(patient);
        vital.setVisit(visit);
        vital.setConsultation(consultation);
        vital.setTemperature(request.getTemperature());
        vital.setPulse(request.getPulse());
        vital.setSystolicBp(request.getSystolicBp());
        vital.setDiastolicBp(request.getDiastolicBp());
        vital.setOxygenSaturation(request.getOxygenSaturation());

        vital.setWeight(request.getWeight());

        vital.setHeight(request.getHeight());

        vital.setRespiratoryRate(request.getRespiratoryRate());

        vital.setRecordedBy(request.getRecordedBy());

        vital.setRecordedAt(LocalDateTime.now());

        return patientVitalRepository.save(vital);
	}

	@Override
	public PatientVital getVital(Long vitalId) {
		return patientVitalRepository.findById(vitalId).orElseThrow(() -> 
							new RuntimeException("Patient vital not foun"));
	}

	@Override
	public List<PatientVital> getPatientVitals(Long patientId) {
		return patientVitalRepository.findByPatientId(patientId);
	}

	@Override
	public List<PatientVital> getConsultationVitals(Long consultationId) {
		return patientVitalRepository.findByConsultationConsultationId(consultationId);
	}

}
