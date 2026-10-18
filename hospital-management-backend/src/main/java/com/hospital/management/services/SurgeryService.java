package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.CompleteSurgeryRequest;
import com.hospital.management.dto.OperationTheaterRequest;
import com.hospital.management.dto.ScheduleSurgeryRequest;
import com.hospital.management.dto.SurgeryRequestDto;
import com.hospital.management.dto.SurgeryTypeRequest;
import com.hospital.management.entity.OperationTheaters;
import com.hospital.management.entity.Surgery;
import com.hospital.management.entity.SurgeryRequest;
import com.hospital.management.entity.SurgeryType;

public interface SurgeryService {
	
	public SurgeryType createSurgeryType(SurgeryTypeRequest request);
	public List<SurgeryType> getAllSurgeryType();
	
	public OperationTheaters createOperationTheatre(OperationTheaterRequest request);
	public List<OperationTheaters> getAllOperationTheaters();
	
	public SurgeryRequest createSurgeryRequest(SurgeryRequestDto request);
	public SurgeryRequest getSurgeryRequest(Long surgeryRequestId);
	public SurgeryRequest approveSurgery(Long requestId);
	
	public Surgery scheduleSurgery(Long requestId, ScheduleSurgeryRequest request);
	public Surgery startSurgery(Long surgeryId);
	public Surgery completeSurgery(Long surgeryId, CompleteSurgeryRequest request);
	public Surgery cancelSurgery(Long surgeryId);
	
	List<Surgery> getSurgeriesByPatient(Long patientId);
	List<Surgery> getSurgeryByStatus(String status);
	

}
