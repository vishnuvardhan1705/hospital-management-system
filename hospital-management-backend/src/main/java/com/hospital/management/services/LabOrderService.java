package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.LabOrderRequest;
import com.hospital.management.entity.LabOrder;
import com.hospital.management.entity.LabOrderItems;

public interface LabOrderService {
	
	public LabOrder createLabOrder(LabOrderRequest request);
	public LabOrder getLabOrder(Long labOrderId);
	public List<LabOrder> getPatientLabOrder(Long patientId);
	public List<LabOrder> getConsultationOrder(Long consultationId);
	public LabOrder updateLabOrder(Long labOrderId, LabOrderRequest request);
	public LabOrderItems addTestToOrder(Long labOrderId,Long testId);
	public List<LabOrderItems> getOrderItems(Long labOrderId);

}
