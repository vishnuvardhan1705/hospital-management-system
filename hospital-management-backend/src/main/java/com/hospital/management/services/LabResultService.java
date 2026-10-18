package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.LabResultRequest;
import com.hospital.management.entity.LabResult;

public interface LabResultService {
	
	public LabResult enterLabResult(LabResultRequest request);
	public LabResult getResult(Long labResultId);
	public List<LabResult> getResultByOrderItem(Long orderItemId);
	public LabResult verifyResult(Long resultId, String verifiedBy);

}
