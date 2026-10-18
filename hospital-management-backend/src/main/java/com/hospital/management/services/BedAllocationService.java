package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.BedAllocationRequest;
import com.hospital.management.entity.BedAllocation;

public interface BedAllocationService {
	
	public BedAllocation allocateBed(BedAllocationRequest request);
	public BedAllocation releaseBed(Long allocationId);
	public List<BedAllocation> getAdmissionHistory(Long admissionId);
	public List<BedAllocation> getPatientHistory(Long patientId);

}
