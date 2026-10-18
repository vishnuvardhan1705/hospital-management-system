package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.LabOrderRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.LabOrder;
import com.hospital.management.entity.LabOrderItems;
import com.hospital.management.entity.LabTest;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.LabOrderItemRepository;
import com.hospital.management.repository.LabOrderRepository;
import com.hospital.management.repository.LabTestsRepository;
import com.hospital.management.repository.PatientRepository;

import jakarta.transaction.Transactional;

@Service
public class LabOrderServiceImpl implements LabOrderService {
	
	private LabOrderRepository labOrderRepository;
	private PatientRepository patientRepository;
	private DoctorRepository doctorRepository;
	private ConsultationRepository consultationRepository;
	private LabOrderItemRepository itemRepository;
	private LabTestsRepository labTestsRepository;
	
	public LabOrderServiceImpl(LabOrderRepository labOrderRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository, ConsultationRepository consultationRepository,
			LabOrderItemRepository itemRepository, LabTestsRepository labTestsRepository) {
		super();
		this.labOrderRepository = labOrderRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.consultationRepository = consultationRepository;
		this.itemRepository = itemRepository;
		this.labTestsRepository = labTestsRepository;
	}

	@Override
	@Transactional
	public LabOrder createLabOrder(LabOrderRequest request) {

		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found with id: "+ request.getPatientId()));

        Consultation consultation =consultationRepository.findById(request.getConsultationId()).orElseThrow(() ->
                        new RuntimeException("Consultation not found with id: "+ request.getConsultationId()));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
        				new RuntimeException("Doctor not found with id: "+ request.getDoctorId()));
		
        if (consultation.getPatient() == null
                || !consultation.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the consultation");
        }

        if (consultation.getDoctor() == null
                || !consultation.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalArgumentException(
                    "Doctor does not match the consultation");
        }
        
        LabOrder labOrder = new LabOrder();
        labOrder.setPatient(patient);
        labOrder.setConsultation(consultation);
        labOrder.setDoctor(doctor);
        labOrder.setOrderDate(LocalDate.now());
        labOrder.setPriority(request.getPriority());

        if (request.getStatus() == null || request.getStatus().isBlank()) {

            labOrder.setStatus("ORDERED");

        } else {
            labOrder.setStatus(request.getStatus());
        }

        LabOrder savedOrder = labOrderRepository.save(labOrder);

        if (request.getTestIds() != null) {

            for (Long testId : request.getTestIds()) {

                addTestToOrder(savedOrder.getId(),testId);
            }
        }
        
		return savedOrder;
	}

	@Override
	public LabOrder getLabOrder(Long labOrderId) {
		return labOrderRepository.findById(labOrderId).orElseThrow(()->
					new RuntimeException("LabOrder Not Found"));
	}

	@Override
	public List<LabOrder> getPatientLabOrder(Long patientId) {

		return labOrderRepository.findByPatientId(patientId);
	}

	@Override
	public List<LabOrder> getConsultationOrder(Long consultationId) {

		return labOrderRepository.findByConsultationConsultationId(consultationId);
	}

	@Override
	public LabOrder updateLabOrder(Long labOrderId, LabOrderRequest request) {
		
		LabOrder labOrder = getLabOrder(labOrderId);

        if (request.getPriority() != null) {
            labOrder.setPriority(request.getPriority());
        }

        if (request.getStatus() != null) {
            labOrder.setStatus(request.getStatus());
        }

		return labOrderRepository.save(labOrder);
	}

	@Override
	public LabOrderItems addTestToOrder(Long labOrderId, Long testId) {

		LabOrder labOrder = getLabOrder(labOrderId);

        LabTest test = labTestsRepository.findById(testId).orElseThrow(() ->
                        new RuntimeException("Lab test not found with id: "+ testId));

        boolean alreadyExists =itemRepository.existsByLabOrderIdAndTestId(labOrderId,testId);

        if (alreadyExists) {

            throw new RuntimeException("This test is already added to the lab order");
        }

        LabOrderItems item = new LabOrderItems();

        item.setLabOrder(labOrder);
        item.setTest(test);
        item.setStatus("ORDERED");
        item.setSampleId(null);

		
		return itemRepository.save(item);
	}

	@Override
	public List<LabOrderItems> getOrderItems(Long labOrderId) {

		getLabOrder(labOrderId);

        return itemRepository.findByLabOrderId(labOrderId);
	}

}
