package com.hospital.management.services;

import java.time.LocalDateTime;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.DischargeMedicationRequest;
import com.hospital.management.dto.DischargeRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.Discharge;
import com.hospital.management.entity.DischargeMedication;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Medicine;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.DIschargeMedicationRepository;
import com.hospital.management.repository.DischargeRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.MedicineRepository;
import com.hospital.management.repository.PatientRepository;


@Service
public class DischargeServiceImpl implements DischargeService {
	
	private DischargeRepository dischargeRepository;
	private DIschargeMedicationRepository dIschargeMedicationRepository;
	private PatientRepository patientRepository;
	private AdmissionRepository admissionRepository;
	private DoctorRepository doctorRepository;
	private MedicineRepository medicineRepository;
	
	public DischargeServiceImpl(DischargeRepository dischargeRepository,
			DIschargeMedicationRepository dIschargeMedicationRepository, PatientRepository patientRepository,
			AdmissionRepository admissionRepository, DoctorRepository doctorRepository,
			MedicineRepository medicineRepository) {
		super();
		this.dischargeRepository = dischargeRepository;
		this.dIschargeMedicationRepository = dIschargeMedicationRepository;
		this.patientRepository = patientRepository;
		this.admissionRepository = admissionRepository;
		this.doctorRepository = doctorRepository;
		this.medicineRepository = medicineRepository;
	}

	@Override
	@Transactional
	public Discharge createDischarge(DischargeRequest request) {
		
        Admission admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(() ->
                        new RuntimeException("Admission not found"));

        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));
        
        if (admission.getPatient() == null
                || !admission.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the admission");
        }

        if (dischargeRepository.existsByAdmissionId(request.getAdmissionId())) {
            throw new RuntimeException("A discharge record already exists for this admission");
        }

        Discharge discharge = new Discharge();

        discharge.setAdmission(admission);
        discharge.setPatient(patient);
        discharge.setDoctor(doctor);
        discharge.setDischargeType(request.getDischargeType());
        discharge.setFinalDiagnosis(request.getFinalDiagnosis());
        discharge.setTreatmentSummary(request.getTreatmentSummary());
        discharge.setConditionAtDischarge(request.getConditionAtDischarge());
        discharge.setInstructions(request.getInstructions());

        discharge.setStatus("PENDING");
        discharge.setDischargeDate(null);

        return dischargeRepository.save(discharge);
	}

	@Override
	public Discharge getDischarge(Long dischargeId) {

		return dischargeRepository.findById(dischargeId).orElseThrow(()->
								new RuntimeException("Discharge not found"));
	}

	@Override
	@Transactional
	public List<Discharge> getDischargeByPatient(Long patientId) {

		return dischargeRepository.findByPatientId(patientId);
	}

	@Override
	public DischargeMedication addDischargeMedication(Long dischargeId, DischargeMedicationRequest request) {
        Discharge discharge = dischargeRepository.findById(dischargeId).orElseThrow(() ->
                        new RuntimeException("Discharge not found"));

        if (!"PENDING".equals(discharge.getStatus())) {
            throw new RuntimeException("Medicines can only be added before discharge is completed");
        }

        Medicine medicine = medicineRepository.findById(request.getMedicineId()).orElseThrow(() ->
                        		new RuntimeException("Medicine not found"));

        DischargeMedication medication = new DischargeMedication();

        medication.setDischarge(discharge);
        medication.setMedicine(medicine);
        medication.setDosage(request.getDosage());
        medication.setFrequency(request.getFrequency());
        medication.setDuration(request.getDuration());
        medication.setInstructions(request.getInstructions());

        return dIschargeMedicationRepository.save(medication);
	}

	@Override
	public List<DischargeMedication> getDischargeMedication(Long dischargeId) {
		
		return dIschargeMedicationRepository.findByDischargeId(dischargeId) ;
	}

	@Override
	public Discharge completeDischarge(Long dischargeId) {
	    Discharge discharge = dischargeRepository.findById(dischargeId)
	            .orElseThrow(() ->
	                    new RuntimeException("Discharge not found"));

	    if (!"PENDING".equals(discharge.getStatus())) {
	        throw new IllegalArgumentException(
	                "Discharge is not in PENDING status");
	    }

	    Admission admission = discharge.getAdmission();

	    if (admission == null) {
	        throw new IllegalStateException(
	                "Discharge has no associated admission");
	    }

	    LocalDateTime now = LocalDateTime.now();

	    discharge.setStatus("DISCHARGED");
	    discharge.setDischargeDate(now);

	    admission.setStatus("DISCHARGED");
	    admission.setActualDischargeDate(now.toLocalDate());

	    admissionRepository.save(admission);
	    return dischargeRepository.save(discharge);
	}

}
