package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.LabOrderItems;

public interface LabOrderItemRepository extends JpaRepository<LabOrderItems, Long> {

	List<LabOrderItems> findByLabOrderId(Long labOrderId);

    boolean existsByLabOrderIdAndTestId(Long labOrderId,Long testId);
}
