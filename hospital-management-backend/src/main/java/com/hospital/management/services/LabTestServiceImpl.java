package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.LabTestsRequest;
import com.hospital.management.entity.LabTest;
import com.hospital.management.repository.LabTestsRepository;

@Service
public class LabTestServiceImpl implements LabTestService {
	
	private LabTestsRepository labTestsRepository;

	public LabTestServiceImpl(LabTestsRepository labTestsRepository) {
		super();
		this.labTestsRepository = labTestsRepository;
	}

	@Override
	public LabTest createLabTest(LabTestsRequest request) {
		
		LabTest test= new LabTest();
		test.setCategory(request.getCategory());
		test.setDescription(request.getDescription());
		test.setNormalRange(request.getNormalRange());
		test.setPrice(request.getPrice());
		test.setStatus(request.getStatus());
		test.setTestName(request.getTestName());
		test.setTestCode(request.getTestCode());
		
		return labTestsRepository.save(test);
	}

	@Override
	public LabTest getLabTest(Long labTestId) {
		
		return labTestsRepository.findById(labTestId).orElseThrow(()->
							new RuntimeException("Test Not found"));
	}

	@Override
	public List<LabTest> searchByTestName(String testName) {

		return labTestsRepository.findByTestNameContainingIgnoreCase(testName);
	}

	@Override
	public List<LabTest> getAllLabTests() {

		return labTestsRepository.findAll();
	}

	@Override
	public LabTest updateLabTest(Long testId, LabTestsRequest request) {
		LabTest test = labTestsRepository.findById(testId).orElseThrow(()->
								new RuntimeException("Test Not found"));
		
		test.setCategory(request.getCategory());
		test.setDescription(request.getDescription());
		test.setNormalRange(request.getNormalRange());
		test.setPrice(request.getPrice());
		test.setStatus(request.getStatus());
		test.setTestName(request.getTestName());
		test.setTestCode(request.getTestCode());
		
		return labTestsRepository.save(test);
	}

}
