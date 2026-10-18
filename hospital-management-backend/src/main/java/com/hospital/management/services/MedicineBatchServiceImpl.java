package com.hospital.management.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.MedicineBatchRequest;
import com.hospital.management.dto.StockUpdateRequest;
import com.hospital.management.entity.Medicine;
import com.hospital.management.entity.MedicineBatch;
import com.hospital.management.repository.MedicineBatchRepository;
import com.hospital.management.repository.MedicineRepository;

@Service
public class MedicineBatchServiceImpl implements MedicineBatchService {
	
	private MedicineBatchRepository batchRepository;
	private MedicineRepository medicineRepository;

	public MedicineBatchServiceImpl(MedicineBatchRepository batchRepository, MedicineRepository medicineRepository) {
		super();
		this.batchRepository = batchRepository;
		this.medicineRepository = medicineRepository;
	}

	@Override
	public MedicineBatch createMedicineBatch(MedicineBatchRequest request) {
		Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found with id: "+ request.getMedicineId()));

        MedicineBatch batch = new MedicineBatch();

        batch.setMedicine(medicine);
        batch.setBatchNumber(request.getBatchNumber());
        batch.setManufacturingDate(request.getManufacturingDate());
        batch.setExpiryDate(request.getExpiryDate());
        batch.setPurchasePrice(request.getPurchasePrice());
        batch.setSellingPrice(request.getSellingPrice());
        batch.setQuantity(request.getQuantity());

		
		return batchRepository.save(batch);
	}

	@Override
	public MedicineBatch getBatch(Long batchId) {
		return batchRepository.findById(batchId).orElseThrow(()->
								new RuntimeException("Batch not found"));
	}

	@Override
	public List<MedicineBatch> getMedicineBatch(Long medicineId) {
		return batchRepository.findByMedicineId(medicineId);
	}

	@Override
	public MedicineBatch updateStock(Long batchId, StockUpdateRequest request) {
		MedicineBatch batch = getBatch(batchId);

        if (request.getQuantity() == null ||request.getQuantity() <= 0) {

            throw new RuntimeException("Quantity must be greater than zero");
        }

        String operation = request.getOperation();

        if ("ADD".equalsIgnoreCase(operation)) {

            batch.setQuantity(batch.getQuantity() + request.getQuantity());

        } else if ("REMOVE".equalsIgnoreCase(operation)) {

            if (batch.getQuantity() < request.getQuantity()) {

                throw new RuntimeException("Insufficient stock");
            }

            batch.setQuantity(batch.getQuantity() - request.getQuantity());

        } else {

            throw new RuntimeException("Operation must be ADD or REMOVE");
        }

		
		return batchRepository.save(batch);
	}

	@Override
	public List<MedicineBatch> getLowStockBatches() {
		List<MedicineBatch> allBatches = batchRepository.findAll();

        List<MedicineBatch> lowStockBatches =new ArrayList<>();

        for (MedicineBatch batch : allBatches) {

            Medicine medicine = batch.getMedicine();

            if (batch.getQuantity() <= medicine.getReorderLevel()) {

                lowStockBatches.add(batch);
            }
        }
		
		return lowStockBatches;
	}

	@Override
	public List<MedicineBatch> getExpiredBatches() {

		return batchRepository.findByExpiryDateBefore(LocalDate.now());
	}

}
