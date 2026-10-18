package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.RadiologyOrder;

public interface RadiologyOrderRepository extends JpaRepository<RadiologyOrder, Long> {

	List<RadiologyOrder> findByPatientId(Long patientId);
	List<RadiologyOrder> findByConsultationConsultationId(Long consultationId);
	List<RadiologyOrder> findByDoctorId(Long doctorId);
	List<RadiologyOrder> findByTestId(Long testId);
}
