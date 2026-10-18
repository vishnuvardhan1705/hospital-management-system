package com.hospital.management.controllers;


import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.MedicineBatchRequest;
import com.hospital.management.dto.StockUpdateRequest;
import com.hospital.management.entity.MedicineBatch;
import com.hospital.management.services.MedicineBatchService;

@RestController
@RequestMapping("/api/medicine-batches")
public class MedicineBatchController {
	
	private MedicineBatchService batchService;

	public MedicineBatchController(MedicineBatchService batchService) {
		super();
		this.batchService = batchService;
	}
	
	@PostMapping
	public MedicineBatch createBatch(@RequestBody MedicineBatchRequest request) {
		 return batchService.createMedicineBatch(request);
	}
	
	@GetMapping("/{batchId}")
	public MedicineBatch getBatch(@PathVariable Long batchId) {
		
		return batchService.getBatch(batchId);
	}
	
	@GetMapping("/medicine/{medicineId}")
	public List<MedicineBatch> getmedicineBatch(@PathVariable Long medicineId){
		
		return batchService.getMedicineBatch(medicineId);
	}
	
	@PatchMapping("/{batchId}/stock")
	public MedicineBatch updateStock(@PathVariable Long batchId,@RequestBody StockUpdateRequest request) {
		
		return batchService.updateStock(batchId, request);
	}
	
	@GetMapping("/expired")
	public List<MedicineBatch> getexpiredbatch(){
		
		return batchService.getExpiredBatches();
	}
	
	@GetMapping("/low-stock")
	public List<MedicineBatch> getlowstock(){
		
		return batchService.getLowStockBatches();
	}

}
