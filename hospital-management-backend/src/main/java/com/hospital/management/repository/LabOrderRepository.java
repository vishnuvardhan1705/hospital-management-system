package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.LabOrder;

public interface LabOrderRepository extends JpaRepository<LabOrder, Long> {

	List<LabOrder> findByPatientId(Long patientId);

    List<LabOrder> findByConsultationConsultationId(Long consultationId);

    List<LabOrder> findByDoctorId(Long doctorId);
}
