package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.LabSampleRequest;
import com.hospital.management.entity.LabOrder;
import com.hospital.management.entity.LabSample;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.LabOrderRepository;
import com.hospital.management.repository.LabSampleRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class LabSampleServiceImpl implements LabSampleService {
	
	private LabSampleRepository labSampleRepository;
	private PatientRepository patientRepository;
	private LabOrderRepository labOrderRepository;

	public LabSampleServiceImpl(LabSampleRepository labSampleRepository, PatientRepository patientRepository,
			LabOrderRepository labOrderRepository) {
		super();
		this.labSampleRepository = labSampleRepository;
		this.patientRepository = patientRepository;
		this.labOrderRepository = labOrderRepository;
	}

	@Override
	public LabSample registerSample(LabSampleRequest request) {
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(()->
									new RuntimeException("Patient not found"));
		
		LabOrder labOrder = labOrderRepository.findById(request.getLabOrderId()).orElseThrow(()->
									new RuntimeException("LabOrder not found"));

		if (labOrder.getPatient() == null
		        || !labOrder.getPatient().getId().equals(patient.getId())) {
		    throw new IllegalArgumentException(
		            "Patient does not match the laboratory order");
		}
		
        LabSample sample = new LabSample();

        sample.setPatient(patient);
        sample.setLabOrder(labOrder);
        sample.setSampleType(request.getSampleType());
        sample.setBarcode(request.getBarcode());
        sample.setCollectedBy(request.getCollectedBy());

        sample.setCollectedAt(LocalDateTime.now());

        if (request.getStatus() != null) {
            sample.setStatus(request.getStatus());
        } else {
            sample.setStatus("COLLECTED");
        }
	
		return labSampleRepository.save(sample);
	}

	@Override
	public LabSample getLabSample(Long sampleId) {

		return labSampleRepository.findById(sampleId).orElseThrow(()->
							new RuntimeException("LabSample not found"));
	}

	@Override
	public List<LabSample> getPatientSamples(Long patientId) {

		return labSampleRepository.findByPatientId(patientId);
	}

	@Override
	public List<LabSample> getSamplesByLabOrder(Long labOrderId) {

		return labSampleRepository.findByLabOrderId(labOrderId);
	}

	@Override
	public LabSample updateSampleStatus(Long sampleId, String status) {

		LabSample sample = labSampleRepository.findById(sampleId).orElseThrow(() ->
                        new RuntimeException("Lab sample not found"));

        sample.setStatus(status);
        
		return labSampleRepository.save(sample);
	}

}
