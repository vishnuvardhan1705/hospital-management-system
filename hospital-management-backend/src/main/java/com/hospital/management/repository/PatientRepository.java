package com.hospital.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hospital.management.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
	
	Optional<Patient> findByMobileNumber(String mobileNumber);
	List<Patient> findByFirstNameContainingIgnoreCase(String firstName);
	List<Patient> findByLastNameContainingIgnoreCase(String LastName);

}
