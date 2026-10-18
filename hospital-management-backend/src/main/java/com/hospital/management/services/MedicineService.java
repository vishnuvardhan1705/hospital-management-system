package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.MedicineRequest;
import com.hospital.management.entity.Medicine;

public interface MedicineService {
	
	public Medicine createMedicine(MedicineRequest request);
	public Medicine getMedicine(Long medicineId);
	public List<Medicine> getAllMedicines();
	public List<Medicine> searchMedicine(String medicineName);
	public Medicine updateMedicine(Long medicineId, MedicineRequest request);

}
