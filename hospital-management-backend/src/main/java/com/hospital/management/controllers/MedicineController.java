package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.MedicineRequest;
import com.hospital.management.entity.Medicine;
import com.hospital.management.services.MedicineService;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
	
	private MedicineService medicineService;

	public MedicineController(MedicineService medicineService) {
		super();
		this.medicineService = medicineService;
	}
	
	@PostMapping
	public Medicine creademedicine(@RequestBody MedicineRequest request) {
		
		return medicineService.createMedicine(request);
	}
	
	@GetMapping
	public List<Medicine> findallmedicines(){
		
		return medicineService.getAllMedicines();
	}
	
	@GetMapping("/{medicineId}")
	public Medicine getmedicine(@PathVariable Long medicineId) {
		
		return medicineService.getMedicine(medicineId);
	}
	
	@GetMapping("/search")
	public List<Medicine> searchMedicine(@RequestParam String medicineName){
		
		return medicineService.searchMedicine(medicineName);
	}
	
	@PutMapping("/{medicineId}")
	public Medicine updatemedicine(@PathVariable Long medicineId, @RequestBody MedicineRequest request) {
		
		return medicineService.updateMedicine(medicineId, request);
	}

}
