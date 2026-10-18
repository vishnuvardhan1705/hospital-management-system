package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.RadiologyTestRequest;
import com.hospital.management.entity.RadiologyTest;
import com.hospital.management.repository.RadiologyTestRepository;

@Service
public class RadiologyTestServiceImpl implements RadiologyTestService {
	
	private RadiologyTestRepository radiologyTestRepository;

	public RadiologyTestServiceImpl(RadiologyTestRepository radiologyTestRepository) {
		super();
		this.radiologyTestRepository = radiologyTestRepository;
	}

	@Override
	public RadiologyTest createTest(RadiologyTestRequest request) {

		RadiologyTest test = new RadiologyTest();

        test.setTestCode(request.getTestCode());
        test.setTestName(request.getTestName());
        test.setModality(request.getModality());
        test.setDescription(request.getDescription());
        test.setPrice(request.getPrice());
        test.setStatus(request.getStatus());
		
		return radiologyTestRepository.save(test);
	}

	@Override
	public RadiologyTest getTest(Long testId) {

		return radiologyTestRepository.findById(testId).orElseThrow(()->
							new RuntimeException("Radiology Test not found"));
	}

	@Override
	public List<RadiologyTest> getAllTests() {

		return radiologyTestRepository.findAll();
	}

	@Override
	public List<RadiologyTest> searchByTestName(String testName) {

		return radiologyTestRepository.findByTestNameContainingIgnoreCase(testName);
	}

	@Override
	public RadiologyTest updateTest(Long testId, RadiologyTestRequest request) {
		RadiologyTest test = radiologyTestRepository.findById(testId).orElseThrow(()->
									new RuntimeException("Radiology Test not found"));
		
		test.setTestCode(request.getTestCode());
        test.setTestName(request.getTestName());
        test.setModality(request.getModality());
        test.setDescription(request.getDescription());
        test.setPrice(request.getPrice());
        test.setStatus(request.getStatus());
        
		return radiologyTestRepository.save(test);
	}

}
