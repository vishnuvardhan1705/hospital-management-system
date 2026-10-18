package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.RadiologyTestRequest;
import com.hospital.management.entity.RadiologyTest;

public interface RadiologyTestService {
	
	public RadiologyTest createTest(RadiologyTestRequest request);
	public RadiologyTest getTest(Long testId);
	public List<RadiologyTest> getAllTests();
	public List<RadiologyTest> searchByTestName(String testName);
	public RadiologyTest updateTest(Long testId, RadiologyTestRequest request);
	
}
