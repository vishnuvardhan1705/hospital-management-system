package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Payments;

public interface PaymentRepository extends JpaRepository<Payments, Long> {
	
	List<Payments> findByBillId(Long billId);

}
