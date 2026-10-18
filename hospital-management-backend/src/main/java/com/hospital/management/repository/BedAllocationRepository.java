package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.BedAllocation;

public interface BedAllocationRepository extends JpaRepository<BedAllocation, Long> {
	
    List<BedAllocation> findByAdmissionId(Long admissionId);

    List<BedAllocation> findByPatientId(Long patientId);

    List<BedAllocation> findByBedId(Long bedId);

    List<BedAllocation> findByStatus(String status);

}
