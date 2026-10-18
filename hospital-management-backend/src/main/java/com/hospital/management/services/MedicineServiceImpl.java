package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.MedicineRequest;
import com.hospital.management.entity.Medicine;
import com.hospital.management.repository.MedicineRepository;

@Service
public class MedicineServiceImpl implements MedicineService {
	
	private MedicineRepository medicineRepository;

	public MedicineServiceImpl(MedicineRepository medicineRepository) {
		super();
		this.medicineRepository = medicineRepository;
	}

	@Override
	public Medicine createMedicine(MedicineRequest request) {
		
        Medicine medicine = new Medicine();

        medicine.setMedicineCode(request.getMedicineCode());

        medicine.setMedicineName(request.getMedicineName());

        medicine.setGenericName(request.getGenericName());

        medicine.setManufacturer(request.getManufacturer());

        medicine.setMedicineType(request.getMedicineType());

        medicine.setUnit(request.getUnit());

        medicine.setTaxPercentage(request.getTaxPercentage());

        medicine.setSellingPrice(request.getSellingPrice());

        medicine.setReorderLevel(request.getReorderLevel());

        medicine.setStatus(request.getStatus());
		
		return medicineRepository.save(medicine);
	}

	@Override
	public Medicine getMedicine(Long medicineId) {
		return medicineRepository.findById(medicineId).orElseThrow(()->
								new RuntimeException("medicine not found"));
	}

	@Override
	public List<Medicine> getAllMedicines() {
		return medicineRepository.findAll();
	}

	@Override
	public List<Medicine> searchMedicine(String medicineName) {
		return medicineRepository.findByMedicineNameContainingIgnoreCase(medicineName);
	}

	@Override
	public Medicine updateMedicine(Long medicineId, MedicineRequest request) {
		Medicine medicine = medicineRepository.findById(medicineId).orElseThrow(()->
									new RuntimeException("medicine not found"));
		
		medicine.setMedicineCode(request.getMedicineCode());

        medicine.setMedicineName(request.getMedicineName());

        medicine.setGenericName(request.getGenericName());

        medicine.setManufacturer(request.getManufacturer());

        medicine.setMedicineType(request.getMedicineType());

        medicine.setUnit(request.getUnit());

        medicine.setTaxPercentage(request.getTaxPercentage());

        medicine.setSellingPrice(request.getSellingPrice());

        medicine.setReorderLevel(request.getReorderLevel());

        medicine.setStatus(request.getStatus());
		
		return medicineRepository.save(medicine);
		
	}

}
