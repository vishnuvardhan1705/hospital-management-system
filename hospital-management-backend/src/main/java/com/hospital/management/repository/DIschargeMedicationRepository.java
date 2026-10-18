package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.DischargeMedication;

public interface DIschargeMedicationRepository extends JpaRepository<DischargeMedication, Long> {

	List<DischargeMedication> findByDischargeId(Long dischargeId);
}
