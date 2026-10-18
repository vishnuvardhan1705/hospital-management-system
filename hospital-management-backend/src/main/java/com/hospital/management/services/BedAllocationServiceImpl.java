package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.BedAllocationRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.Bed;
import com.hospital.management.entity.BedAllocation;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.BedAllocationRepository;
import com.hospital.management.repository.BedRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class BedAllocationServiceImpl implements BedAllocationService {
	
	private BedAllocationRepository allocationRepository;
	private PatientRepository patientRepository;
	private AdmissionRepository admissionRepository;
	private BedRepository bedRepository;

	public BedAllocationServiceImpl(BedAllocationRepository allocationRepository, PatientRepository patientRepository,
			AdmissionRepository admissionRepository, BedRepository bedRepository) {
		super();
		this.allocationRepository = allocationRepository;
		this.patientRepository = patientRepository;
		this.admissionRepository = admissionRepository;
		this.bedRepository = bedRepository;
	}

	@Override
	@Transactional
	public BedAllocation allocateBed(BedAllocationRequest request) {
		Admission admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(()->
								new RuntimeException("Admission not found"));
		
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(()->
								new RuntimeException("Patient not found"));
		
		Bed bed = bedRepository.findById(request.getBedId()).orElseThrow(()->
								new RuntimeException("Bed not found"));
		
		if (admission.getPatient() == null
		        || !admission.getPatient().getId().equals(patient.getId())) {
		    throw new IllegalArgumentException(
		            "Patient does not match the admission");
		}
		
		if(!"AVAILABLE".equalsIgnoreCase(bed.getStatus())) {
			throw new RuntimeException("Only available beds can be allocated");
		}
		
        BedAllocation allocation = new BedAllocation();

        allocation.setAdmission(admission);
        allocation.setPatient(patient);
        allocation.setBed(bed);
        allocation.setAllocatedAt(LocalDateTime.now());
        allocation.setStatus("ACTIVE");

        bed.setStatus("OCCUPIED");

        bedRepository.save(bed);

        return allocationRepository.save(allocation);
	}

	@Override
	@Transactional
	public BedAllocation releaseBed(Long allocationId) {
		BedAllocation allocation = allocationRepository.findById(allocationId).orElseThrow(()->
										new RuntimeException("Allocation not found"));
		
		if(!"ACTIVE".equalsIgnoreCase(allocation.getStatus())) {
			throw new RuntimeException("Bed allocation is not active");
		}
		
		allocation.setReleasedAt(LocalDateTime.now());
		allocation.setStatus("RELEASED");
	
		Bed bed = allocation.getBed();
		
		bed.setStatus("AVAILABLE");
		bedRepository.save(bed);
		
		return allocationRepository.save(allocation);
	}

	@Override
	public List<BedAllocation> getAdmissionHistory(Long admissionId) {

		return allocationRepository.findByAdmissionId(admissionId);
	}

	@Override
	public List<BedAllocation> getPatientHistory(Long patientId) {

		return allocationRepository.findByPatientId(patientId);
	}

}
