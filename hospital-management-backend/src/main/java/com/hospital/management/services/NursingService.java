package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.MedicationAdministrationRequest;
import com.hospital.management.dto.NursingAssignmentRequest;
import com.hospital.management.dto.NursingNotesRequest;
import com.hospital.management.entity.MedicationAdministration;
import com.hospital.management.entity.NursingAssignment;
import com.hospital.management.entity.NursingNote;

public interface NursingService {
	
	public NursingAssignment assignPatient(NursingAssignmentRequest request);
	public List<NursingAssignment> getAssignedPatients(Long nurseId);
	public NursingNote addNursingNote(NursingNotesRequest request);
	public NursingNote updateNotes(Long nursingNoteId, NursingNotesRequest request);
   
	public MedicationAdministration administerMedication(MedicationAdministrationRequest request);
    public List<NursingNote> getPatientNursingNotes(Long patientId);
    public List<MedicationAdministration> getPatientMedicationHistory(Long patientId);

}
