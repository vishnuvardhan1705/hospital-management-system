package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.PrescriptionItemRequest;
import com.hospital.management.dto.PrescriptionRequest;
import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.PrescriptionItem;

public interface PrescriptionService {
	
	public Prescription createPrescription(Long consultationId,PrescriptionRequest request);
	public Prescription getPrescription(Long prescriptionId);
	public List<Prescription> getPatientPrescriptions(Long patientId);
	public List<Prescription> getActivePrescriptions();
	public Prescription updatePrescription(Long prescriptionId, PrescriptionRequest request);
	
	public PrescriptionItem addMedicine(Long prescriptionId,PrescriptionItemRequest request);
	public List<PrescriptionItem> getPrescriptionItems(Long prescriptionId);
	public void removeMedicine(Long prescriptionItemId);
	
	public Prescription markAsDispensed(Long prescriptionId);

}
