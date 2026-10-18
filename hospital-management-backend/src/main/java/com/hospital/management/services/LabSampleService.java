package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.LabSampleRequest;
import com.hospital.management.entity.LabSample;

public interface LabSampleService {
	
	public LabSample registerSample(LabSampleRequest request);
	public LabSample getLabSample(Long sampleId);
	public List<LabSample> getPatientSamples(Long patientId);
	public List<LabSample> getSamplesByLabOrder(Long labOrderId);
	public LabSample updateSampleStatus(Long sampleId,String status);

}
