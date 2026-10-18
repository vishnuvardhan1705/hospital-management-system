package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.PaymentRequest;
import com.hospital.management.dto.RefundRequest;
import com.hospital.management.entity.Payments;
import com.hospital.management.entity.Refund;

public interface PaymentService {

	public Payments createPayment(PaymentRequest request);
	public Payments getPayment(Long paymentId);
	public List<Payments> getPaymentsByBillId(Long billId);
	public Refund createRefund(Long paymentId,RefundRequest request);
}
