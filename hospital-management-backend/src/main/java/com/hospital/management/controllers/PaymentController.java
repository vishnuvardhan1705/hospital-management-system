package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PaymentRequest;
import com.hospital.management.dto.RefundRequest;
import com.hospital.management.entity.Payments;
import com.hospital.management.entity.Refund;
import com.hospital.management.services.PaymentService;

@RestController
@RequestMapping("/api")
public class PaymentController {

	private PaymentService paymentService;

	public PaymentController(PaymentService paymentService) {
		super();
		this.paymentService = paymentService;
	}
	
	@PostMapping("/payments")
	public Payments createPayment(@RequestBody PaymentRequest request) {
		
		return paymentService.createPayment(request);
	}
	
	@GetMapping("/payments/{paymentId}")
	public Payments getpayment(@PathVariable Long paymentId) {
		
		return paymentService.getPayment(paymentId);
	}
	
	@GetMapping("/bills/{billId}/payments")
	public List<Payments> getpaymentsByBills(@PathVariable Long billId){
		
		return paymentService.getPaymentsByBillId(billId);
	}
	
	@PostMapping("/payments/{paymentId}/refund")
	public Refund createrefund(@PathVariable Long paymentId, @RequestBody RefundRequest request) {
		
		return paymentService.createRefund(paymentId, request);
	}
}
