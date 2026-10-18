package com.hospital.management.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.DispenseMedicineRequest;
import com.hospital.management.entity.MedicineBatch;
import com.hospital.management.entity.MedicineDispensing;
import com.hospital.management.entity.PharmacyTransaction;
import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.PrescriptionItem;
import com.hospital.management.repository.MedicineBatchRepository;
import com.hospital.management.repository.MedicineDispensingRepository;
import com.hospital.management.repository.PharmacyTransactionRepository;
import com.hospital.management.repository.PrescriptionItemRepository;

@Service
public class MedicineDispensingServiceImpl implements MedicineDispensingService {
	
	private  MedicineDispensingRepository dispensingRepository;
    private  PharmacyTransactionRepository transactionRepository;
    private  MedicineBatchRepository batchRepository;
    private  PrescriptionItemRepository prescriptionItemRepository;

	public MedicineDispensingServiceImpl(MedicineDispensingRepository dispensingRepository,
			PharmacyTransactionRepository transactionRepository, MedicineBatchRepository batchRepository,
			PrescriptionItemRepository prescriptionItemRepository) {
		super();
		this.dispensingRepository = dispensingRepository;
		this.transactionRepository = transactionRepository;
		this.batchRepository = batchRepository;
		this.prescriptionItemRepository = prescriptionItemRepository;
	}

	@Override
	@Transactional
	public MedicineDispensing dispenseMedicine(DispenseMedicineRequest request) {
		PrescriptionItem item =prescriptionItemRepository.findById(request.getPrescriptionItemId())
                        .orElseThrow(() ->new RuntimeException("Prescription item not found"));

        MedicineBatch batch =batchRepository.findById(request.getBatchId())
                        .orElseThrow(() ->new RuntimeException("Medicine batch not found"));

        if (request.getQuantity() == null || request.getQuantity() <= 0) {

            throw new RuntimeException("Quantity must be greater than zero");
        }

        if (!batch.getMedicine().getId().equals(item.getMedicineId())) {

            throw new RuntimeException("Selected batch does not belong to the prescribed medicine");
        }

        if (batch.getExpiryDate() != null && batch.getExpiryDate().isBefore(LocalDate.now())) {

            throw new RuntimeException("Expired medicine cannot be dispensed");
        }

  
        if (batch.getQuantity() <request.getQuantity()) {

            throw new RuntimeException("Insufficient stock");
        }

        batch.setQuantity(batch.getQuantity() - request.getQuantity());

        batchRepository.save(batch);

        Prescription prescription = item.getPrescription();

        MedicineDispensing dispensing = new MedicineDispensing();

        dispensing.setPrescription(prescription);
        dispensing.setPatient(prescription.getPatient());
        dispensing.setMedicine(batch.getMedicine());
        dispensing.setBatch(batch);
        dispensing.setQuantity(request.getQuantity());
        dispensing.setDispensedBy(request.getDispensedBy());
        dispensing.setDispensedAt(LocalDateTime.now());

        MedicineDispensing savedDispensing = dispensingRepository.save(dispensing);

        
        PharmacyTransaction transaction = new PharmacyTransaction();

        transaction.setMedicine(batch.getMedicine());
        transaction.setBatch(batch);
        transaction.setTransactionType("DISPENSE");
        transaction.setQuantity(request.getQuantity());
        transaction.setReferenceId(String.valueOf(prescription.getId()));
        transaction.setTransactionDate(
                LocalDateTime.now());
        transaction.setPerformedBy(request.getDispensedBy());

        transactionRepository.save(transaction);
        
		return savedDispensing;
	}

	@Override
	public MedicineDispensing getDispensing(Long dispensingId) {
		return dispensingRepository.findById(dispensingId).orElseThrow(() ->
                        new RuntimeException("Dispensing record not found"));
	}

	@Override
	public List<MedicineDispensing> getPatientDispensing(Long patientId) {
		
		return dispensingRepository.findByPatientId(patientId);
	}

	@Override
	public List<MedicineDispensing> getPrescriptionDispensing(Long prescriptionId) {
		
		return dispensingRepository.findByPrescriptionId(prescriptionId);
	}

}
