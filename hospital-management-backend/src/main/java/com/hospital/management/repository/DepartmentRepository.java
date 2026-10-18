package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
	
	List<Department> findByHospitalId(Long hospid);

}
