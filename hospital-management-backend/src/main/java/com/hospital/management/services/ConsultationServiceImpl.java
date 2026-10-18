package com.hospital.management.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.ConsultationRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PatientVisit;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PatientVisitRepository;

@Service
public class ConsultationServiceImpl implements ConsultationService {
	
	private  ConsultationRepository consultationRepository;
    private  PatientVisitRepository patientVisitRepository;
    private  PatientRepository patientRepository;
    private  DoctorRepository doctorRepository;
    
	public ConsultationServiceImpl(ConsultationRepository consultationRepository,
			PatientVisitRepository patientVisitRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository) {
		this.consultationRepository = consultationRepository;
		this.patientVisitRepository = patientVisitRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
	}

	@Override
	public Consultation createConsultation(ConsultationRequest request) {
		PatientVisit visit = patientVisitRepository.findById(request.getVisitId())
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->new RuntimeException("Doctor not found"));

        if (visit.getPatient() == null
                || !visit.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the visit");
        }

        if (visit.getDoctor() == null
                || !visit.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException(
                    "Doctor does not match the visit");
        }
        
        Consultation consultation = new Consultation();

        consultation.setVisit(visit);
        consultation.setPatient(patient);
        consultation.setDoctor(doctor);

        consultation.setConsultationDate(LocalDate.now());

        consultation.setChiefComplaint(request.getChiefComplaint());

        consultation.setClinicalNotes( request.getClinicalNotes());

        consultation.setExaminationNotes( request.getExaminationNotes());

        consultation.setTreatmentPlan(request.getTreatmentPlan());

        consultation.setFollowUpRequired( request.getFollowUpRequired());

        consultation.setFollowUpDate( request.getFollowUpDate());

        consultation.setStatus("IN_PROGRESS");

        consultation.setCreatedAt(LocalDateTime.now());

        return consultationRepository.save(consultation);
	}

	@Override
	public Consultation getConsultation(Long consultationId) {
		return consultationRepository.findById(consultationId).orElseThrow(() -> 
							new RuntimeException("Consultation not found"));
	}

	@Override
	public List<Consultation> getPatientConsultations(Long patientId) {
		return consultationRepository.findByPatientId(patientId);
	}

	@Override
	public Consultation updateConsultation(Long consultationId, ConsultationRequest request) {
		Consultation consultation = consultationRepository.findById(consultationId).orElseThrow(() ->
                        new RuntimeException("Consultation not found"));

        consultation.setChiefComplaint(request.getChiefComplaint());

        consultation.setClinicalNotes(request.getClinicalNotes());

        consultation.setExaminationNotes(request.getExaminationNotes());

        consultation.setTreatmentPlan(request.getTreatmentPlan());

        consultation.setFollowUpRequired( request.getFollowUpRequired());

        consultation.setFollowUpDate(request.getFollowUpDate());

        return consultationRepository.save(consultation);
	}

}
