package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.EmergencyVisitRequest;
import com.hospital.management.entity.EmergencyVisit;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.EmergencyVisitRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class EmergencyVisitServiceImpl implements EmergencyVisitService {
	
	private EmergencyVisitRepository emergencyVisitRepository;
	private PatientRepository patientRepository;

	public EmergencyVisitServiceImpl(EmergencyVisitRepository emergencyVisitRepository,
			PatientRepository patientRepository) {
		super();
		this.emergencyVisitRepository = emergencyVisitRepository;
		this.patientRepository = patientRepository;
	}

	@Override
	public EmergencyVisit createEmergencyVisit(EmergencyVisitRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        EmergencyVisit visit = new EmergencyVisit();

        visit.setPatient(patient);
        visit.setArrivalTime(LocalDateTime.now());
        visit.setArrivalMode(request.getArrivalMode());
        visit.setChiefComplaint(request.getChiefComplaint());
        visit.setPriority(request.getPriority());
        visit.setAssignedDoctor(request.getAssignedDoctor());
        visit.setStatus("REGISTERED");

        return emergencyVisitRepository.save(visit);
	}

	@Override
	public EmergencyVisit getEmergencyVisit(Long visitId) {
		
		return emergencyVisitRepository.findById(visitId).orElseThrow(()->
						new RuntimeException("EmergencyVisit not found"));
	}

	@Override
	public List<EmergencyVisit> getAllEmergencyVisits() {
		
		return emergencyVisitRepository.findAll();
	}

	@Override
	public List<EmergencyVisit> getPatientEmergencyVisits(Long patientId) {
		
		return emergencyVisitRepository.findByPatientId(patientId);
	}

	@Override
	public EmergencyVisit updateEmergencyVisit(Long visitId, EmergencyVisitRequest request) {
		
        EmergencyVisit visit = getEmergencyVisit(visitId);

        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                            new RuntimeException("Patient not found"));

            visit.setPatient(patient);
        }

        if (request.getArrivalMode() != null) {
            visit.setArrivalMode(request.getArrivalMode());
        }

        if (request.getChiefComplaint() != null) {
            visit.setChiefComplaint(request.getChiefComplaint());
        }

        if (request.getPriority() != null) {
            visit.setPriority(request.getPriority());
        }

        if (request.getAssignedDoctor() != null) {
            visit.setAssignedDoctor(request.getAssignedDoctor());
        }

        if (request.getStatus() != null) {
            visit.setStatus(request.getStatus());
        }

        return emergencyVisitRepository.save(visit);
	}

	@Override
	public EmergencyVisit assignDoctor(Long emergencyVisitId, Long doctorId) {
        EmergencyVisit visit = getEmergencyVisit(emergencyVisitId);

        visit.setAssignedDoctor(doctorId);

        return emergencyVisitRepository.save(visit);
	}

	@Override
	public EmergencyVisit recordEmergencyTreatment(Long emergencyVisitId) {
	    EmergencyVisit emergencyVisit = emergencyVisitRepository.findById(emergencyVisitId).orElseThrow(() ->
	                    new RuntimeException("Emergency visit not found"));

	    emergencyVisit.setStatus("UNDER_TREATMENT");

	    return emergencyVisitRepository.save(emergencyVisit);
	}

	@Override
	public EmergencyVisit dischargeEmergencyPatient(Long emergencyVisitId) {
	    EmergencyVisit emergencyVisit = emergencyVisitRepository.findById(emergencyVisitId)
	            			.orElseThrow(() ->new RuntimeException("Emergency visit not found"));

	    if (!"UNDER_TREATMENT".equals(emergencyVisit.getStatus())) {
	        throw new IllegalArgumentException(
	                "Only patients under treatment can be discharged");
	    }
	    
	    emergencyVisit.setStatus("DISCHARGED");

	    return emergencyVisitRepository.save(emergencyVisit);
	}

	@Override
	public EmergencyVisit markEmergencyVisitAdmitted(Long emergencyVisitId) {
	    EmergencyVisit emergencyVisit = emergencyVisitRepository
	            .findById(emergencyVisitId)
	            .orElseThrow(() ->
	                    new RuntimeException("Emergency visit not found"));

	    emergencyVisit.setStatus("ADMITTED");

	    return emergencyVisitRepository.save(emergencyVisit);
	}

}
