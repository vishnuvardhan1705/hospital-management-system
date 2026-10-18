package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.RadiologyOrderRequest;
import com.hospital.management.entity.Consultation;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.RadiologyOrder;
import com.hospital.management.entity.RadiologyTest;
import com.hospital.management.repository.ConsultationRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.RadiologyOrderRepository;
import com.hospital.management.repository.RadiologyTestRepository;

@Service
public class RadiologyOrderServiceImpl implements RadiologyOrderService {
	
	private RadiologyOrderRepository orderRepository;
	private PatientRepository patientRepository;
	private DoctorRepository doctorRepository;
	private ConsultationRepository consultationRepository;
	private RadiologyTestRepository radiologyTestRepository;

	public RadiologyOrderServiceImpl(RadiologyOrderRepository orderRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository, ConsultationRepository consultationRepository,
			RadiologyTestRepository radiologyTestRepository) {
		super();
		this.orderRepository = orderRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.consultationRepository = consultationRepository;
		this.radiologyTestRepository = radiologyTestRepository;
	}

	@Override
	public RadiologyOrder createRadiologyOrder(RadiologyOrderRequest request) {
		
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        	new RuntimeException("Patient not found"));

        Consultation consultation = consultationRepository.findById(request.getConsultationId()).orElseThrow(() ->
                        	new RuntimeException("Consultation not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                        	new RuntimeException("Doctor not found"));

        RadiologyTest test = radiologyTestRepository.findById(request.getTestId()).orElseThrow(() ->
                        	new RuntimeException("Radiology test not found"));

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
        
        RadiologyOrder order = new RadiologyOrder();

        order.setPatient(patient);
        order.setConsultation(consultation);
        order.setDoctor(doctor);
        order.setTest(test);

        order.setOrderDate(LocalDate.now());

        if (request.getPriority() != null) {
            order.setPriority(request.getPriority());
        } else {
            order.setPriority("NORMAL");
        }

        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        } else {
            order.setStatus("ORDERED");
        }

		
		return orderRepository.save(order);
	}

	@Override
	public RadiologyOrder getRadiologyOrder(Long radiologyOrderId) {

		return orderRepository.findById(radiologyOrderId).orElseThrow(()->
							new RuntimeException("RadiologyOrder not found"));
	}

	@Override
	public List<RadiologyOrder> getOrderByPatient(Long patientId) {

		return orderRepository.findByPatientId(patientId);
	}

	@Override
	public List<RadiologyOrder> getOrderByDoctor(Long doctorId) {

		return orderRepository.findByDoctorId(doctorId);
	}

	@Override
	public List<RadiologyOrder> getOrderByConsultation(Long consultationId) {

		return orderRepository.findByConsultationConsultationId(consultationId);
	}

	@Override
	public RadiologyOrder updateRadiologyOrder(Long orderId, RadiologyOrderRequest request) {

		RadiologyOrder order = orderRepository.findById(orderId).orElseThrow(()->
							new RuntimeException("RadiologyOrder not found"));
		
		if (request.getPriority() != null) {
            order.setPriority(request.getPriority());
        }

        if (request.getStatus() != null) {
            order.setStatus(request.getStatus());
        }
        
		return orderRepository.save(order);
	}

	@Override
	public RadiologyOrder sheduleRadiology(Long orderId) {
		
		RadiologyOrder order = orderRepository.findById(orderId).orElseThrow(()->
								new RuntimeException("RadiologyOrder not found"));
		order.setStatus("SCHEDULED");
		
		return orderRepository.save(order);
	}

}
