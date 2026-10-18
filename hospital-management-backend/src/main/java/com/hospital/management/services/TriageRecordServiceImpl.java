package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.TriageRecordRequest;
import com.hospital.management.entity.EmergencyVisit;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.TriageRecord;
import com.hospital.management.repository.EmergencyVisitRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.TriageRecordRepository;

@Service
public class TriageRecordServiceImpl implements TriageRecordService {
	
	private TriageRecordRepository recordRepository;
	private EmergencyVisitRepository emergencyVisitRepository;
	private PatientRepository patientRepository;

	public TriageRecordServiceImpl(TriageRecordRepository recordRepository,
			EmergencyVisitRepository emergencyVisitRepository, PatientRepository patientRepository) {
		super();
		this.recordRepository = recordRepository;
		this.emergencyVisitRepository = emergencyVisitRepository;
		this.patientRepository = patientRepository;
	}

	@Override
	public TriageRecord recordTriage(TriageRecordRequest request) {
        EmergencyVisit emergencyVisit =emergencyVisitRepository.findById(request.getEmergencyVisitId())
                        .orElseThrow(() -> new RuntimeException("Emergency visit not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                		.orElseThrow(() ->new RuntimeException("Patient not found"));

        TriageRecord record = new TriageRecord();

        record.setEmergencyVisit(emergencyVisit);
        record.setPatient(patient);
        record.setPriority(request.getPriority());
        record.setSymptoms(request.getSymptoms());
        record.setVitals(request.getVitals());
        record.setTriageNotes(request.getTriageNotes());
        record.setAssessedBy(request.getAssessedBy());
        record.setAssessedAt(LocalDateTime.now());

        return recordRepository.save(record);
	}

	@Override
	public TriageRecord getTriageRecord(Long triageId) {
		
		return recordRepository.findById(triageId).orElseThrow(()->
						new RuntimeException("Triage Record not found"));
	}

	@Override
	public List<TriageRecord> getTriageByEmergencyVisit(Long emergencyVisitId) {
				
		return recordRepository.findByEmergencyVisitEmergencyVisitId(emergencyVisitId);
	}

	@Override
	public List<TriageRecord> getPatientTriageHistory(Long patientId) {
		
		return recordRepository.findByPatientId(patientId);
	}

}
