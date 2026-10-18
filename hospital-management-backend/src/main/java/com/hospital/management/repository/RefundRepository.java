package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Refund;

public interface RefundRepository extends JpaRepository<Refund, Long> {
	
	List<Refund> findByPaymentId(Long paymentId);
}
