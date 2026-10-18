package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.InsuranceClaimRequest;
import com.hospital.management.dto.InsuranceClaimSettlementRequest;
import com.hospital.management.dto.PatientInsuranceRequest;
import com.hospital.management.entity.InsuranceClaim;
import com.hospital.management.entity.PatientInsurance;

public interface InsuranceService {
	
	public PatientInsurance createPolicy(PatientInsuranceRequest request);
	public List<PatientInsurance> getPatientInsurance(Long patientId);
	
	public InsuranceClaim createClaim(InsuranceClaimRequest request);
	public InsuranceClaim getClaim(Long claimId);
	public InsuranceClaim submitClaim(Long claimId);
	public InsuranceClaim settleClaim(Long claimId, InsuranceClaimSettlementRequest request);
	
}
