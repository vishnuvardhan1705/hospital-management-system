package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.RadiologyOrderRequest;
import com.hospital.management.entity.RadiologyOrder;

public interface RadiologyOrderService {
	
	public RadiologyOrder createRadiologyOrder(RadiologyOrderRequest request);
	public RadiologyOrder getRadiologyOrder(Long radiologyOrderId);
	public List<RadiologyOrder> getOrderByPatient(Long patientId);
	public List<RadiologyOrder> getOrderByDoctor(Long doctorId);
	public List<RadiologyOrder> getOrderByConsultation(Long consultationId);
	public RadiologyOrder updateRadiologyOrder(Long orderId,RadiologyOrderRequest request);
	public RadiologyOrder sheduleRadiology(Long orderId);

}
