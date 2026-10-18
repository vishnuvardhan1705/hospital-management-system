package com.hospital.management.services;

import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.InsuranceClaimRequest;
import com.hospital.management.dto.InsuranceClaimSettlementRequest;
import com.hospital.management.dto.PatientInsuranceRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.Bill;
import com.hospital.management.entity.InsuranceClaim;
import com.hospital.management.entity.InsuranceProvider;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PatientInsurance;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.BillRepository;
import com.hospital.management.repository.InsuranceClaimRepository;
import com.hospital.management.repository.InsuranceProviderRepository;
import com.hospital.management.repository.PatientInsuranceRepository;
import com.hospital.management.repository.PatientRepository;


@Service
public class InsuranceServiceImpl implements InsuranceService {

	private InsuranceClaimRepository claimRepository;
	private PatientInsuranceRepository patientInsuranceRepository;
	private InsuranceProviderRepository insuranceProviderRepository;
	private PatientRepository patientRepository;
	private BillRepository billRepository;
	private AdmissionRepository admissionRepository;
	
	public InsuranceServiceImpl(InsuranceClaimRepository claimRepository,
			PatientInsuranceRepository patientInsuranceRepository,
			InsuranceProviderRepository insuranceProviderRepository, PatientRepository patientRepository,
			BillRepository billRepository, AdmissionRepository admissionRepository) {
		super();
		this.claimRepository = claimRepository;
		this.patientInsuranceRepository = patientInsuranceRepository;
		this.insuranceProviderRepository = insuranceProviderRepository;
		this.patientRepository = patientRepository;
		this.billRepository = billRepository;
		this.admissionRepository = admissionRepository;
	}

	@Override
	@Transactional
	public PatientInsurance createPolicy(PatientInsuranceRequest request) {
		
		if (request.getStartDate() == null
		        || request.getExpiryDate() == null) {
		    throw new IllegalArgumentException(
		            "Policy start date and expiry date are required");
		}

		if (request.getExpiryDate().isBefore(request.getStartDate())) {
		    throw new IllegalArgumentException(
		            "Expiry date cannot be before start date");
		}

		if (request.getCoverageAmount() == null
		        || request.getCoverageAmount() <= 0) {
		    throw new IllegalArgumentException(
		            "Coverage amount must be greater than zero");
		}
		
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        InsuranceProvider provider = insuranceProviderRepository.findById(request.getProviderId()).orElseThrow(() ->
                        new RuntimeException("Insurance provider not found"));	
		
        PatientInsurance policy = new PatientInsurance();
        policy.setPatient(patient);
        policy.setProvider(provider);
        policy.setPolicyNumber(request.getPolicyNumber());
        policy.setPolicyHolderName(request.getPolicyHolderName());
        policy.setPolicyType(request.getPolicyType());
        policy.setCoverageAmount(request.getCoverageAmount());
        policy.setStartDate(request.getStartDate());
        policy.setExpiryDate(request.getExpiryDate());
        
        boolean expired = request.getExpiryDate().isBefore(LocalDate.now());
        
        policy.setStatus(expired ? "EXPIRED" : "ACTIVE");
        
        
        return patientInsuranceRepository.save(policy);
	}

	@Override
	@Transactional
	public List<PatientInsurance> getPatientInsurance(Long patientId) {
		
		return patientInsuranceRepository.findByPatientId(patientId);
	}

	@Override
	@Transactional
	public InsuranceClaim createClaim(InsuranceClaimRequest request) {
		if (request.getClaimedAmount() == null
		        || request.getClaimedAmount() <= 0) {
		    throw new IllegalArgumentException(
		            "Claimed amount must be greater than zero");
		}
        
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        	new RuntimeException("Patient not found"));

        Bill bill = billRepository.findById(request.getBillId()).orElseThrow(() ->
                        	new RuntimeException("Bill not found"));
        
        PatientInsurance policy = patientInsuranceRepository.findById(request.getPatientInsuranceId()).orElseThrow(() ->
                        new RuntimeException("Patient insurance policy not found"));
		
        if(!bill.getPatient().getId().equals(patient.getId())) {
        	 throw new RuntimeException("Patient does not match the bill");      		
        }
        
        if(!policy.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("Insurance policy does not belong to this patient");        	       	
        }
        
        if(!"ACTIVE".equals(policy.getStatus()) || policy.getStartDate().isAfter(LocalDate.now()) || policy.getExpiryDate().isBefore(LocalDate.now())) {
        	throw new RuntimeException("Insurance policy is not currently active");
        }
        
        Admission admission = null;
        
        if (request.getAdmissionId() != null) {
            admission = admissionRepository.findById(request.getAdmissionId()).orElseThrow(() ->
                            new RuntimeException("Admission not found"));
        }
        
        InsuranceClaim claim = new InsuranceClaim();
        claim.setPatient(patient);
        claim.setBill(bill);
        claim.setPatientInsurance(policy);
        claim.setAdmission(admission);
        claim.setClaimedAmount(request.getClaimedAmount());
        claim.setApprovedAmount(0.0);
        claim.setRejectedAmount(0.0);
        claim.setStatus("CREATED");

        InsuranceClaim savedClaim = claimRepository.save(claim);

        savedClaim.setClaimNumber("CLM-" + savedClaim.getId());

        return claimRepository.save(savedClaim);
	}

	@Override
	@Transactional
	public InsuranceClaim getClaim(Long claimId) {

		return claimRepository.findById(claimId).orElseThrow(() ->
                new RuntimeException("Insurance claim not found"));
	}

	@Override
	public InsuranceClaim submitClaim(Long claimId) {
        InsuranceClaim claim = claimRepository.findById(claimId).orElseThrow(() ->
                        new RuntimeException("Insurance claim not found"));

        if (!"CREATED".equals(claim.getStatus())) {
            throw new RuntimeException("Only newly created claims can be submitted");
        }

        claim.setStatus("SUBMITTED");
        claim.setSubmittedDate(LocalDateTime.now());

        return claimRepository.save(claim);
	}

	@Override
	@Transactional
	public InsuranceClaim settleClaim(Long claimId, InsuranceClaimSettlementRequest request) {
        
		InsuranceClaim claim = claimRepository.findById(claimId).orElseThrow(() ->
                        new RuntimeException("Insurance claim not found"));

        if (!"SUBMITTED".equals(claim.getStatus())) {
            throw new RuntimeException("Only submitted claims can be settled");
        }

        if (request.getApprovedAmount() == null || request.getRejectedAmount() == null || request.getApprovedAmount() < 0
                	|| request.getRejectedAmount() < 0) {

            throw new RuntimeException("Approved and rejected amounts must be zero or greater");
        }

        double totalProcessed = request.getApprovedAmount() + request.getRejectedAmount();

        if (totalProcessed > claim.getClaimedAmount()) {
            throw new RuntimeException("Approved and rejected amounts cannot exceed the claimed amount");
        }

        claim.setApprovedAmount(request.getApprovedAmount());
        claim.setRejectedAmount(request.getRejectedAmount());
        claim.setSettlementDate(LocalDateTime.now());
        claim.setStatus("SETTLED");

        return claimRepository.save(claim);
	}

}
