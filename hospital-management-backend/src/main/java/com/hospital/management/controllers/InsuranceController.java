package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.InsuranceClaimRequest;
import com.hospital.management.dto.InsuranceClaimSettlementRequest;
import com.hospital.management.dto.PatientInsuranceRequest;
import com.hospital.management.entity.InsuranceClaim;
import com.hospital.management.entity.PatientInsurance;
import com.hospital.management.services.InsuranceService;

@RestController
@RequestMapping("/api")
public class InsuranceController {

	private InsuranceService insuranceService;

	public InsuranceController(InsuranceService insuranceService) {
		super();
		this.insuranceService = insuranceService;
	}
	
	@PostMapping("/insurance/policies")
	public PatientInsurance createPolicy(@RequestBody PatientInsuranceRequest request) {

	    PatientInsurance policy = insuranceService.createPolicy(request);
	    return policy;
	}

	@GetMapping("/patients/{patientId}/insurance")
	public List<PatientInsurance> getPatientInsurance(@PathVariable Long patientId) {

	    return insuranceService.getPatientInsurance(patientId);
	}

	@PostMapping("/insurance/claims")
	public InsuranceClaim createClaim(@RequestBody InsuranceClaimRequest request) {
	    InsuranceClaim claim = insuranceService.createClaim(request);

	    return claim;
	}

	@GetMapping("/insurance/claims/{claimId}")
	public InsuranceClaim getClaimById(@PathVariable Long claimId) {

	    return insuranceService.getClaim(claimId);
	}

	@PostMapping("/insurance/claims/{claimId}/submit")
	public InsuranceClaim submitClaim(@PathVariable Long claimId) {

	    return insuranceService.submitClaim(claimId);
	}

	@PostMapping("/insurance/claims/{claimId}/settle")
	public InsuranceClaim settleClaim(@PathVariable Long claimId, @RequestBody InsuranceClaimSettlementRequest request) {

	    return insuranceService.settleClaim(claimId, request);
	}
}
