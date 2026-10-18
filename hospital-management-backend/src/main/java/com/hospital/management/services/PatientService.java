package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.PatientRequest;
import com.hospital.management.entity.Patient;

public interface PatientService {

	public Patient registerPatient(PatientRequest request);
	public List<Patient> findAllPatient();
	public Patient findById(Long id);
	public Patient findByMobileNumber(String mobileNumber);
	public List<Patient> findByFirstName(String firstName);
	public Patient updatePatient(Long id, PatientRequest request);
	
}
