package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.FollowUpRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Discharge;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.FollowUp;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.DischargeRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.FollowUpRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class FollowUpServiceImpl implements FollowUpService {
	
	private FollowUpRepository followUpRepository;
	private PatientRepository patientRepository;
	private DoctorRepository doctorRepository;
	private ConsultationRepository consultationRepository;
	private DischargeRepository dischargeRepository;

	public FollowUpServiceImpl(FollowUpRepository followUpRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository, ConsultationRepository consultationRepository,
			DischargeRepository dischargeRepository) {
		super();
		this.followUpRepository = followUpRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.consultationRepository = consultationRepository;
		this.dischargeRepository = dischargeRepository;
	}

	@Override
	public FollowUp createFollowUp(FollowUpRequest request) {
		
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        FollowUp followUp = new FollowUp();

        followUp.setPatient(patient);
        followUp.setDoctor(doctor);

        setOptionalReferences(followUp, request);

        followUp.setFollowUpDate(request.getFollowUpDate());
        followUp.setReason(request.getReason());
        followUp.setNotes(request.getNotes());
        followUp.setStatus("SCHEDULED");

        return followUpRepository.save(followUp);
	}

	@Override
	public FollowUp updateFollowUp(Long followUpId, FollowUpRequest request) {
        FollowUp followUp = getFollowUp(followUpId);

        if (!"SCHEDULED".equals(followUp.getStatus())) {
            throw new RuntimeException("Only scheduled follow-ups can be updated");
        }

        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                            new RuntimeException("Patient not found"));

            followUp.setPatient(patient);
        }

        if (request.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                            new RuntimeException("Doctor not found"));

            followUp.setDoctor(doctor);
        }

        if (request.getFollowUpDate() != null) {
            followUp.setFollowUpDate(request.getFollowUpDate());
        }

        if (request.getReason() != null) {
            followUp.setReason(request.getReason());
        }

        if (request.getNotes() != null) {
            followUp.setNotes(request.getNotes());
        }

        setOptionalReferences(followUp, request);

        return followUpRepository.save(followUp);
	}
	
    private void setOptionalReferences(FollowUp followUp,FollowUpRequest request) {

        if (request.getConsultationId() != null) {
            Consultation consultation = consultationRepository.findById(request.getConsultationId()).orElseThrow(() ->
                            new RuntimeException("Consultation not found"));

            followUp.setConsultation(consultation);
        }

        if (request.getDischargeId() != null) {
            Discharge discharge = dischargeRepository.findById(request.getDischargeId()).orElseThrow(() ->
                            new RuntimeException("Discharge not found"));

            followUp.setDischarge(discharge);
        }
    }

	@Override
	public FollowUp getFollowUp(Long followUpId) {
		
		return followUpRepository.findById(followUpId).orElseThrow(()->
						new RuntimeException("FollowUp not found"));
	}

	@Override
	public List<FollowUp> getFollowUpByPatient(Long patientId) {

		return followUpRepository.findByPatientId(patientId);
	}

	@Override
	public List<FollowUp> getUpcomingFollowUp() {
		
		return followUpRepository.findByFollowUpDateGreaterThanEqual(LocalDate.now()).stream()
                		.filter(followUp ->"SCHEDULED".equals(followUp.getStatus())).toList();
	}

	@Override
	public FollowUp completeFollowUp(Long followUpId) {
        FollowUp followUp = getFollowUp(followUpId);

        if (!"SCHEDULED".equals(followUp.getStatus())) {
            throw new RuntimeException("Only scheduled follow-ups can be completed");
        }

        followUp.setStatus("COMPLETED");

        return followUpRepository.save(followUp);
	}

	@Override
	public FollowUp cancelFollowUp(Long followUpId) {
        FollowUp followUp = getFollowUp(followUpId);

        if (!"SCHEDULED".equals(followUp.getStatus())) {
            throw new RuntimeException("Only scheduled follow-ups can be cancelled");
        }

        followUp.setStatus("CANCELLED");

        return followUpRepository.save(followUp);
	}

}
