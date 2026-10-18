package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.BillItemRequest;
import com.hospital.management.dto.BillRequest;
import com.hospital.management.dto.BillUpdateRequest;
import com.hospital.management.entity.Bill;
import com.hospital.management.entity.BillItem;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.BillItemRepository;
import com.hospital.management.repository.BillRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class BillingServiceImpl implements BillingService {
	
	private BillRepository billRepository;
	private BillItemRepository billItemRepository;
	private PatientRepository patientRepository;

	public BillingServiceImpl(BillRepository billRepository, BillItemRepository billItemRepository,
			PatientRepository patientRepository) {
		super();
		this.billRepository = billRepository;
		this.billItemRepository = billItemRepository;
		this.patientRepository = patientRepository;
	}
	
	private double value(Double amount) {
		return amount == null ? 0.0 : amount;
	}

    private Bill findBill(Long billId) {
        return billRepository.findById(billId).orElseThrow(() ->
                        new RuntimeException("Bill not found"));
    }
    
    private void ensureEditable(Bill bill) {
        if (!"DRAFT".equals(bill.getStatus())) {
            throw new RuntimeException(
                    "Only a DRAFT bill can be modified");
        }
    }
    
	@Override
	public Bill createBill(BillRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        if (value(request.getDiscount()) < 0 || value(request.getInsuranceAmount()) < 0) {
            throw new RuntimeException("Discount and insurance amount cannot be negative");
        }

        Bill bill = new Bill();

        bill.setPatient(patient);
        bill.setVisitId(request.getVisitId());
        bill.setAdmissionId(request.getAdmissionId());
        bill.setBillType(request.getBillType());
        bill.setSubtotal(0.0);
        bill.setDiscount(value(request.getDiscount()));
        bill.setTax(0.0);
        bill.setInsuranceAmount(value(request.getInsuranceAmount()));
        bill.setTotalAmount(0.0);
        bill.setPaidAmount(0.0);
        bill.setOutstandingAmount(0.0);
        bill.setStatus("DRAFT");
        bill.setBillDate(LocalDateTime.now());

        Bill savedBill = billRepository.save(bill);

        savedBill.setBillNumber("BILL-" + savedBill.getId());

        return billRepository.save(savedBill);
	}

	@Override
	public Bill getBill(Long billId) {
		
		return findBill(billId);
	}

	@Override
	public Bill updateBill(Long billId, BillUpdateRequest request) {
        Bill bill = findBill(billId);
        ensureEditable(bill);

        if (request.getDiscount() != null) {
            if (request.getDiscount() < 0) {
                throw new RuntimeException("Discount cannot be negative");
            }
            bill.setDiscount(request.getDiscount());
        }

        if (request.getInsuranceAmount() != null) {
            if (request.getInsuranceAmount() < 0) {
                throw new RuntimeException(
                        "Insurance amount cannot be negative");
            }
            bill.setInsuranceAmount(request.getInsuranceAmount());
        }

        if (request.getBillType() != null) {
            bill.setBillType(request.getBillType());
        }

        billRepository.save(bill);

        return calculateBill(billId);
	}

	@Override
	public BillItem addBillItem( Long billId,BillItemRequest request) {
		
        Bill bill = findBill(billId);
        ensureEditable(bill);

        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        if (request.getUnitPrice() == null || request.getUnitPrice() < 0) {
            throw new RuntimeException("Unit price cannot be negative");
        }

        double itemDiscount = value(request.getDiscount());
        double itemTax = value(request.getTax());

        if (itemDiscount < 0 || itemTax < 0) {
            throw new RuntimeException("Item discount and tax cannot be negative");
        }

        double baseAmount = request.getQuantity() * request.getUnitPrice();

        if (itemDiscount > baseAmount) {
            throw new RuntimeException("Item discount cannot exceed its base amount");
        }

        BillItem item = new BillItem();

        item.setBill(bill);
        item.setServiceId(request.getServiceId());
        item.setDescription(request.getDescription());
        item.setQuantity(request.getQuantity());
        item.setUnitPrice(request.getUnitPrice());
        item.setDiscount(itemDiscount);
        item.setTax(itemTax);

        item.setTotalAmount(baseAmount - itemDiscount + itemTax);
        BillItem savedItem = billItemRepository.save(item);

        calculateBill(billId);

        return savedItem;
	}

	@Override
	public void removeBillItem(Long billId, Long billItemId) {
		
        Bill bill = findBill(billId);
        ensureEditable(bill);

        BillItem item = billItemRepository.findById(billItemId).orElseThrow(() ->
                        new RuntimeException("Bill item not found"));

        if (!item.getBill().getId().equals(billId)) {
            throw new RuntimeException("This item does not belong to the specified bill");
        }

        billItemRepository.delete(item);

        calculateBill(billId);

	}

	@Override
	public Bill calculateBill(Long billId) {
		
        Bill bill = findBill(billId);

        List<BillItem> items = billItemRepository.findByBillId(billId);

        double subtotal = 0.0;
        double itemDiscountTotal = 0.0;
        double taxTotal = 0.0;

        for (BillItem item : items) {

            double baseAmount = item.getQuantity() * item.getUnitPrice();

            double itemDiscount = value(item.getDiscount());
            double itemTax = value(item.getTax());

            double itemTotal = baseAmount - itemDiscount + itemTax;

            item.setTotalAmount(itemTotal);
            billItemRepository.save(item);

            subtotal += baseAmount;
            itemDiscountTotal += itemDiscount;
            taxTotal += itemTax;
        }

        double billDiscount = value(bill.getDiscount());
        double insurance = value(bill.getInsuranceAmount());

        double totalDiscount = billDiscount + itemDiscountTotal;

        if (totalDiscount > subtotal) {
            throw new RuntimeException("Total discount cannot exceed subtotal");
        }

        double totalAmount = subtotal - totalDiscount + taxTotal - insurance;

        if (totalAmount < 0) {
            throw new RuntimeException("Total amount cannot be negative");
        }

        double paidAmount = value(bill.getPaidAmount());

        bill.setSubtotal(subtotal);
        bill.setTax(taxTotal);
        bill.setTotalAmount(totalAmount);
        bill.setPaidAmount(paidAmount);
        bill.setOutstandingAmount(Math.max(0.0, totalAmount - paidAmount));

        return billRepository.save(bill);
	}

	@Override
	public Bill finalizeBill(Long billId) {
        Bill bill = findBill(billId);
        ensureEditable(bill);

        List<BillItem> items = billItemRepository.findByBillId(billId);

        if (items.isEmpty()) {
            throw new RuntimeException("Add at least one item before finalizing the bill");
        }

        Bill calculatedBill = calculateBill(billId);

        calculatedBill.setStatus("FINALIZED");

        return billRepository.save(calculatedBill);
	}

	@Override
	public Bill cancelBill(Long billId) {
        Bill bill = findBill(billId);

        if (!"DRAFT".equals(bill.getStatus())) {
            throw new RuntimeException("Only a DRAFT bill can be cancelled");
        }

        bill.setStatus("CANCELLED");

        return billRepository.save(bill);
	}

	@Override
	public List<Bill> getPatientBills(Long patientId) {
		
		return billRepository.findByPatientId(patientId);
	}

	@Override
	public List<BillItem> getBillItems(Long billId) {
		findBill(billId);
		
		return billItemRepository.findByBillId(billId);
	}

}
