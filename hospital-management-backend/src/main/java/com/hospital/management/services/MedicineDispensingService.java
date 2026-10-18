package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.DispenseMedicineRequest;
import com.hospital.management.entity.MedicineDispensing;

public interface MedicineDispensingService {
	
	public MedicineDispensing dispenseMedicine(DispenseMedicineRequest request);
	
	public MedicineDispensing getDispensing(Long dispensingId);

    public List<MedicineDispensing> getPatientDispensing(Long patientId);

    public List<MedicineDispensing> getPrescriptionDispensing(Long prescriptionId);

}
