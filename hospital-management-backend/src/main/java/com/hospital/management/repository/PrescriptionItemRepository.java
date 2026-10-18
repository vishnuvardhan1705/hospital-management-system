package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.PrescriptionItem;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long>{
	
	List<PrescriptionItem> findByPrescriptionId(Long prescriptionId);

}
