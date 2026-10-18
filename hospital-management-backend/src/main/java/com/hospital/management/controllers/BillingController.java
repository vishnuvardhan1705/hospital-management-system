package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.BillItemRequest;
import com.hospital.management.dto.BillRequest;
import com.hospital.management.dto.BillUpdateRequest;
import com.hospital.management.entity.Bill;
import com.hospital.management.entity.BillItem;
import com.hospital.management.services.BillingService;

@RestController
@RequestMapping("/api")
public class BillingController {

	private BillingService billingService;

	public BillingController(BillingService billingService) {
		super();
		this.billingService = billingService;
	}
	
    @PostMapping("/bills")
    public Bill createBill(@RequestBody BillRequest request) {
        return billingService.createBill(request);
    }

    @GetMapping("/bills/{billId}")
    public Bill getBill(@PathVariable Long billId) {
        return billingService.getBill(billId);
    }

    @PutMapping("/bills/{billId}")
    public Bill updateBill(@PathVariable Long billId, @RequestBody BillUpdateRequest request) {
        return billingService.updateBill(billId, request);
    }

    @PostMapping("/bills/{billId}/items")
    public BillItem addBillItem( @PathVariable Long billId,@RequestBody BillItemRequest request) {
        return billingService.addBillItem(billId, request);
    }

    @DeleteMapping("/bills/{billId}/items/{billItemId}")
    public String removeBillItem(@PathVariable Long billId,@PathVariable Long billItemId) {

        billingService.removeBillItem(billId, billItemId);
        return "Bill item removed successfully";
    }

    @GetMapping("/bills/{billId}/items")
    public List<BillItem> getBillItems(@PathVariable Long billId) {
        return billingService.getBillItems(billId);
    }

    @PostMapping("/bills/{billId}/calculate")
    public Bill calculateBill(@PathVariable Long billId) {
        return billingService.calculateBill(billId);
    }

    @PostMapping("/bills/{billId}/finalize")
    public Bill finalizeBill(@PathVariable Long billId) {
        return billingService.finalizeBill(billId);
    }

    @PostMapping("/bills/{billId}/cancel")
    public Bill cancelBill(@PathVariable Long billId) {
        return billingService.cancelBill(billId);
    }

    @GetMapping("/patients/{patientId}/bills")
    public List<Bill> getPatientBills(
            @PathVariable Long patientId) {
        return billingService.getPatientBills(patientId);
    }
}
