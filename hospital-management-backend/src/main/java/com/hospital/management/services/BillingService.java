package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.BillItemRequest;
import com.hospital.management.dto.BillRequest;
import com.hospital.management.dto.BillUpdateRequest;
import com.hospital.management.entity.Bill;
import com.hospital.management.entity.BillItem;

public interface BillingService {

	public Bill createBill(BillRequest request);
	public Bill getBill(Long billId);
	public Bill updateBill(Long billId, BillUpdateRequest request);
	
	public BillItem addBillItem( Long billId,BillItemRequest request);
	public void removeBillItem(Long billId, Long billItemId);

	public Bill calculateBill(Long billId);
	public Bill finalizeBill(Long billId);
	public Bill cancelBill(Long billId);

	public List<Bill> getPatientBills(Long patientId);
	public List<BillItem> getBillItems(Long billId);
	
}
