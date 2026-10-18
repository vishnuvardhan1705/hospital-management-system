package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospital.management.dto.PatientRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {
	
	@Autowired
	private PatientRepository patientRepository;

	public PatientServiceImpl(PatientRepository patientRepository) {
		this.patientRepository = patientRepository;
	}

	@Override
	public Patient registerPatient(PatientRequest request) {
		
		if(patientRepository.findByMobileNumber(request.getMobileNumber()).isPresent()) {
			throw new RuntimeException("Patient already registered with mobile number : "+request.getMobileNumber());
		}
		Patient patient = new Patient();
		
		patient.setPatientNumber(generatePatientNumber());
		
		patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMobileNumber(request.getMobileNumber());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setPincode(request.getPincode());

        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactNumber(request.getEmergencyContactNumber());
        patient.setIdentificationType(request.getIdentificationType());
        patient.setIdentificationNumber(request.getIdentificationNumber());
        patient.setStatus(request.getStatus());
        patient.setCreatedAt(LocalDateTime.now());

        return patientRepository.save(patient);
        
	}
	
	public String generatePatientNumber() {
		Long nextId = patientRepository.count() + 1;
		
		
		return String.format("PAT-%05d", nextId);
	}

	@Override
	public List<Patient> findAllPatient() {
		return patientRepository.findAll();
	}

	@Override
	public Patient findById(Long id) {
		return patientRepository.findById(id).orElseThrow(()->
									new RuntimeException("Patient not found with id : "+id));
	}

	@Override
	public Patient findByMobileNumber(String mobileNumber) {
		
		return patientRepository.findByMobileNumber(mobileNumber).orElseThrow(()->
									new RuntimeException("Patient not found with mobile number : "+mobileNumber));
	}

	@Override
	public List<Patient> findByFirstName(String firstName) {
		return patientRepository.findByFirstNameContainingIgnoreCase(firstName);
	}

	@Override
	public Patient updatePatient(Long id, PatientRequest request) {
		Patient patient = findById(id);
		
		patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setMobileNumber(request.getMobileNumber());
        patient.setEmail(request.getEmail());
        patient.setAddress(request.getAddress());
        patient.setCity(request.getCity());
        patient.setState(request.getState());
        patient.setPincode(request.getPincode());

        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactNumber(request.getEmergencyContactNumber());
        patient.setIdentificationType(request.getIdentificationType());
        patient.setIdentificationNumber(request.getIdentificationNumber());
        patient.setStatus(request.getStatus());
		
		return patientRepository.save(patient);
	}

}
