package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.MedicineBatchRequest;
import com.hospital.management.dto.StockUpdateRequest;
import com.hospital.management.entity.MedicineBatch;

public interface MedicineBatchService {
	
	public MedicineBatch createMedicineBatch(MedicineBatchRequest request);
	public MedicineBatch getBatch(Long batchId);
	public List<MedicineBatch> getMedicineBatch(Long medicineId);
	
	public MedicineBatch updateStock(Long batchId,StockUpdateRequest request);
	public List<MedicineBatch> getExpiredBatches();
	public List<MedicineBatch> getLowStockBatches();

}
