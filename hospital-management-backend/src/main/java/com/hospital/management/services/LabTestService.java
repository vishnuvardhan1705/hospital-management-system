package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.LabTestsRequest;
import com.hospital.management.entity.LabTest;

public interface LabTestService {
	
	public LabTest createLabTest(LabTestsRequest request);
	public LabTest getLabTest(Long labTestId);
	public List<LabTest> searchByTestName(String testName);
	public List<LabTest> getAllLabTests();
	public LabTest updateLabTest(Long testId,LabTestsRequest request);

}
