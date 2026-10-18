package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.LabResultRequest;
import com.hospital.management.entity.LabOrderItems;
import com.hospital.management.entity.LabResult;
import com.hospital.management.entity.LabTest;
import com.hospital.management.repository.LabOrderItemRepository;
import com.hospital.management.repository.LabResultRepository;
import com.hospital.management.repository.LabTestsRepository;

@Service
public class LabResultServiceImpl implements LabResultService {
	
	private LabResultRepository labResultRepository;
	private LabOrderItemRepository itemRepository;
	private LabTestsRepository labTestsRepository;

	public LabResultServiceImpl(LabResultRepository labResultRepository, LabOrderItemRepository itemRepository,
			LabTestsRepository labTestsRepository) {
		super();
		this.labResultRepository = labResultRepository;
		this.itemRepository = itemRepository;
		this.labTestsRepository = labTestsRepository;
	}

	@Override
	public LabResult enterLabResult(LabResultRequest request) {
		LabOrderItems items = itemRepository.findById(request.getOrderItemId()).orElseThrow(()->
									new RuntimeException("LabOrderItem not found"));
		LabTest test = labTestsRepository.findById(request.getTestId()).orElseThrow(() ->
                        			new RuntimeException("Lab test not found"));

		if (items.getTest() == null
		        || !items.getTest().getId().equals(test.getId())) {
		    throw new IllegalArgumentException(
		            "Test does not match the laboratory order item");
		}
		
        LabResult result = new LabResult();

        result.setOrderItem(items);
        result.setTest(test);
        result.setResultValue(request.getResultValue());
        result.setUnit(request.getUnit());
        result.setReferenceRange(request.getReferenceRange());
        result.setAbnormalFlag(request.getAbnormalFlag());
        result.setRemarks(request.getRemarks());
        result.setEnteredBy(request.getEnteredBy());
        result.setResultDate(LocalDateTime.now());

        return labResultRepository.save(result);
	}

	@Override
	public LabResult getResult(Long labResultId) {

		return labResultRepository.findById(labResultId).orElseThrow(()->
										new RuntimeException("LabResult not found"));
	}

	@Override
	public List<LabResult> getResultByOrderItem(Long orderItemId) {

		return labResultRepository.findByOrderItemId(orderItemId);
	}

	@Override
	public LabResult verifyResult(Long resultId, String verifiedBy) {

		LabResult result = labResultRepository.findById(resultId).orElseThrow(() ->
                        			new RuntimeException("Lab result not found"));

		if (verifiedBy == null || verifiedBy.isBlank()) {
		    throw new IllegalArgumentException(
		            "Verifier name is required");
		}
		
        result.setVerifiedBy(verifiedBy);

        return labResultRepository.save(result);
	}

}
