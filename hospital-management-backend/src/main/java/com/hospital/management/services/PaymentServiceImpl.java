package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.PaymentRequest;
import com.hospital.management.dto.RefundRequest;
import com.hospital.management.entity.Bill;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Payments;
import com.hospital.management.entity.Refund;
import com.hospital.management.repository.BillRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PaymentRepository;
import com.hospital.management.repository.RefundRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

	private PaymentRepository paymentRepository;
	private RefundRepository refundRepository;
	private BillRepository billRepository;
	private PatientRepository patientRepository;
	
	public PaymentServiceImpl(PaymentRepository paymentRepository, RefundRepository refundRepository,
			BillRepository billRepository, PatientRepository patientRepository) {
		super();
		this.paymentRepository = paymentRepository;
		this.refundRepository = refundRepository;
		this.billRepository = billRepository;
		this.patientRepository = patientRepository;
	}

	@Override
	@Transactional
	public Payments createPayment(PaymentRequest request) {
        Bill bill = billRepository.findById(request.getBillId()).orElseThrow(() ->
                        new RuntimeException("Bill not found"));

        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));
        
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero");
        }

        if (request.getPaymentMethod() == null
                || request.getPaymentMethod().isBlank()) {
            throw new IllegalArgumentException(
                    "Payment method is required");
        }

        if (!"FINALIZED".equals(bill.getStatus())
                && !"PARTIALLY_PAID".equals(bill.getStatus())) {
            throw new IllegalArgumentException(
                    "Payment can only be made against a finalized bill");
        }

        if (!patient.getId().equals(bill.getPatient().getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match bill");
        }

        double outstanding = bill.getOutstandingAmount() == null
                ? 0.0
                : bill.getOutstandingAmount();

        if (request.getAmount() > outstanding) {
            throw new IllegalArgumentException(
                    "Payment cannot exceed the outstanding amount");
        }
		
        if(!bill.getPatient().getId().equals(patient.getId())) {
        	
        	throw new RuntimeException("Patient does not match bill");
        }
        
        
        if(request.getAmount()>outstanding) {
        	
        	throw new RuntimeException("Payment cannot exceed the outstanding amount");
        }
        
        Payments payment = new Payments();
        
        payment.setBill(bill);
        payment.setPatient(patient);
        
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus("SUCCESS");
        payment.setTransactionReference(request.getTransactionReference());
        Payments savedPayment = paymentRepository.save(payment);
        
        double payedAmount = bill.getPaidAmount() == null ? 0.0 : bill.getPaidAmount();
        
        payedAmount += request.getAmount();
        outstanding -= request.getAmount();
        
        bill.setPaidAmount(payedAmount);
        bill.setOutstandingAmount(Math.max(0.0,outstanding));
        
        if(bill.getOutstandingAmount() == 0.0) {
        	bill.setStatus("FULLY_PAID");
        }
        else {
        	bill.setStatus("PARTIALLY_PAID");
        }
        
        billRepository.save(bill);
        
        return savedPayment;
        
	}

	@Override
	public Payments getPayment(Long paymentId) {
		
		return paymentRepository.findById(paymentId).orElseThrow(()->
						new RuntimeException("Payment not found"));
	}

	@Override
	public List<Payments> getPaymentsByBillId(Long billId) {
		
		return paymentRepository.findByBillId(billId);
	}

	@Override
	public Refund createRefund(Long paymentId ,RefundRequest request) {
		
		if(request.getAmount() == null || request.getAmount()<=0) {
			throw new RuntimeException("Refund amount must be greater than zero");
		}
		
        Payments payment = paymentRepository.findById(paymentId).orElseThrow(() ->
                        new RuntimeException("Payment not found"));
		
        if(!"SUCCESS".equals(payment.getStatus())) {
        	throw new RuntimeException("Only successful payments can be refunded");
        }
        
        List<Refund> existingRefunds = refundRepository.findByPaymentId(paymentId);
        
        double alreadyRequested = existingRefunds.stream().mapToDouble(refund -> refund.getAmount()).sum();
        
        if(alreadyRequested + request.getAmount()>payment.getAmount()) {
        	
        	throw new RuntimeException("Total refunds cannot exceed payment amount");
        }
        
        Refund refund = new Refund();
        refund.setPayment(payment);
        refund.setAmount(request.getAmount());
        refund.setReason(request.getReason());
        refund.setApprovedBy(request.getApprovedBy());
        refund.setRefundDate(LocalDateTime.now());
        refund.setStatus("PENDING");

        return refundRepository.save(refund);
	}

}
