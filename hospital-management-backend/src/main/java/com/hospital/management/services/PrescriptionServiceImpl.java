package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.PrescriptionItemRequest;
import com.hospital.management.dto.PrescriptionRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.PrescriptionItem;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PrescriptionItemRepository;
import com.hospital.management.repository.PrescriptionRepository;

@Service
public class PrescriptionServiceImpl implements PrescriptionService {
	
	private PrescriptionRepository prescriptionRepository;
	private PrescriptionItemRepository prescriptionItemRepository;
	private PatientRepository patientRepository;
	private ConsultationRepository consultationRepository;
	private DoctorRepository doctorRepository;

	public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository,
			PrescriptionItemRepository itemRepository, PatientRepository patientRepository,
			ConsultationRepository consultationRepository, DoctorRepository doctorRepository) {
		super();
		this.prescriptionRepository = prescriptionRepository;
		this.prescriptionItemRepository = itemRepository;
		this.patientRepository = patientRepository;
		this.consultationRepository = consultationRepository;
		this.doctorRepository = doctorRepository;
	}

	@Override
	public Prescription createPrescription(Long consultationId, PrescriptionRequest request) {
		Consultation consultation =consultationRepository.findById(consultationId)
                .orElseThrow(() ->new RuntimeException("Consultation not found with id : "+ consultationId));

        Patient patient =patientRepository.findById(request.getPatientId())
                .orElseThrow(() ->new RuntimeException( "Patient not found with id : "+ request.getPatientId()));

        Doctor doctor =
                doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                    new RuntimeException("Doctor not found with id : " + request.getDoctorId()));
        
        Prescription prescription = new Prescription();
        
        prescription.setConsultation(consultation);
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setPrescriptionDate(LocalDate.now());
        prescription.setInstructions(request.getInstructions());
        prescription.setStatus("ACTIVE");

		return prescriptionRepository.save(prescription);
	}

	@Override
	public Prescription getPrescription(Long prescriptionId) {
		return prescriptionRepository.findById(prescriptionId).orElseThrow(() ->
        					new RuntimeException("Prescription not found with id : "+ prescriptionId));
	}

	@Override
	public List<Prescription> getPatientPrescriptions(Long patientId) {
		return prescriptionRepository.findByPatientId(patientId);
	}

	@Override
	public List<Prescription> getActivePrescriptions() {
		return prescriptionRepository.findByStatus("ACTIVE");
	}

	@Override
	public Prescription updatePrescription(Long prescriptionId, PrescriptionRequest request) {
		
		Prescription prescription =prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() ->new RuntimeException( "Prescription not found with id : "+ prescriptionId));

        Patient patient =patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                    new RuntimeException("Patient not found with id : " + request.getPatientId()));

        Doctor doctor =doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() ->new RuntimeException("Doctor not found with id : "+ request.getDoctorId()));

        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setInstructions(request.getInstructions());
		
		return prescriptionRepository.save(prescription);
	}

	@Override
	public PrescriptionItem addMedicine(Long prescriptionId, PrescriptionItemRequest request) {

		Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(()->
									new RuntimeException("Prescription not found"));
		
		PrescriptionItem item = new PrescriptionItem();
		
		item.setPrescription(prescription);
        item.setMedicineId(request.getMedicineId());
        item.setDosage(request.getDosage());
        item.setFrequency(request.getFrequency());
        item.setDuration(request.getDuration());
        item.setRoute(request.getRoute());
        item.setQuantity(request.getQuantity());
        item.setInstructions(request.getInstructions());
		
		return prescriptionItemRepository.save(item);
	}

	@Override
	public List<PrescriptionItem> getPrescriptionItems(Long prescriptionId) {
		return prescriptionItemRepository.findByPrescriptionId(prescriptionId);
	}

	@Override
	public void removeMedicine(Long prescriptionItemId) {
		PrescriptionItem item = prescriptionItemRepository.findById(prescriptionItemId).orElseThrow(()->
								new RuntimeException("PrescriptionItem not found"));
		
		prescriptionItemRepository.delete(item);

	}

	@Override
	public Prescription markAsDispensed(Long prescriptionId) {

		Prescription prescription = prescriptionRepository.findById(prescriptionId).orElseThrow(() ->
										new RuntimeException("Prescription not found with id : "+ prescriptionId));
		
		prescription.setStatus("DISPENSED");
		
		return prescriptionRepository.save(prescription);
	}

}
