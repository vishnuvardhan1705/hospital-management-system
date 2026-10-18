package com.hospital.management.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.MedicationAdministrationRequest;
import com.hospital.management.dto.NursingAssignmentRequest;
import com.hospital.management.dto.NursingNotesRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.MedicationAdministration;
import com.hospital.management.entity.NursingAssignment;
import com.hospital.management.entity.NursingNote;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.MedicationAdministrationRepository;
import com.hospital.management.repository.NursingAssignmentRepository;
import com.hospital.management.repository.NursingNotesRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class NursingServiceImpl implements NursingService {
	
	private NursingAssignmentRepository assignmentRepository;
	private NursingNotesRepository notesRepository;
	private MedicationAdministrationRepository administrationRepository;
	private PatientRepository patientRepository;
	private AdmissionRepository admissionRepository;

	public NursingServiceImpl(NursingAssignmentRepository assignmentRepository, NursingNotesRepository notesRepository,
			MedicationAdministrationRepository administrationRepository, PatientRepository patientRepository,
			AdmissionRepository admissionRepository) {
		super();
		this.assignmentRepository = assignmentRepository;
		this.notesRepository = notesRepository;
		this.administrationRepository = administrationRepository;
		this.patientRepository = patientRepository;
		this.admissionRepository = admissionRepository;
	}

	@Override
	public NursingAssignment assignPatient(NursingAssignmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Admission admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(() ->
                        new RuntimeException("Admission not found"));

        NursingAssignment assignment =new NursingAssignment();

        assignment.setNurseId(request.getNurseId());
        assignment.setPatient(patient);
        assignment.setAdmission(admission);
        assignment.setAssignedDate(LocalDate.now());
        assignment.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        return assignmentRepository.save(assignment);
	}

	@Override
	public List<NursingAssignment> getAssignedPatients(Long nurseId) {

		return assignmentRepository.findByNurseId(nurseId);
	}

	@Override
	public NursingNote addNursingNote(NursingNotesRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Admission admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(() ->
                        new RuntimeException("Admission not found"));

        NursingNote note = new NursingNote();

        note.setPatient(patient);
        note.setAdmission(admission);
        note.setNurseId(request.getNurseId());
        note.setObservation(request.getObservation());
        note.setActionTaken(request.getActionTaken());
        note.setCreatedAt(LocalDateTime.now());

        return notesRepository.save(note);
	}

	@Override
	public NursingNote updateNotes(Long nursingNoteId, NursingNotesRequest request) {
        NursingNote note = notesRepository.findById(nursingNoteId).orElseThrow(() ->
                        new RuntimeException("Nursing note not found"));

        note.setObservation(request.getObservation());
        note.setActionTaken(request.getActionTaken());

        return notesRepository.save(note);
	}

	@Override
	public MedicationAdministration administerMedication(MedicationAdministrationRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        		new RuntimeException("Patient not found"));

        Admission admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(() ->
        						new RuntimeException("Admission not found"));

        MedicationAdministration administration =new MedicationAdministration();

        administration.setPatient(patient);
        administration.setAdmission(admission);
        administration.setPrescriptionItemId(request.getPrescriptionItemId());
        administration.setMedicineId(request.getMedicineId());
        administration.setAdministeredBy(request.getAdministeredBy());
        administration.setAdministeredAt(LocalDateTime.now());
        administration.setDosage(request.getDosage());
        administration.setStatus(request.getStatus());
        administration.setRemarks(request.getRemarks());

        return administrationRepository.save(administration);
	}

	@Override
	public List<NursingNote> getPatientNursingNotes(Long patientId) {
		
		return notesRepository.findByPatientId(patientId);
	}

	@Override
	public List<MedicationAdministration> getPatientMedicationHistory(Long patientId) {
		
		return administrationRepository.findByPatientId(patientId);
	}

}
