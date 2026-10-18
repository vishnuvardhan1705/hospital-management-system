package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
	
	List<Doctor> findByHospitalId(Long hospid);
	
	List<Doctor> findByDepartmentId(Long depid);

}
