package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Ward;

public interface WardRepository extends JpaRepository<Ward, Long> {

	List<Ward> findByDepartmentId(Long departmentId);
}
