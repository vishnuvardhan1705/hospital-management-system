package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.RadiologyReportRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.RadiologyOrder;
import com.hospital.management.entity.RadiologyReport;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.RadiologyOrderRepository;
import com.hospital.management.repository.RadiologyReportRepository;

@Service
public class RadiologyReportServiceImpl implements RadiologyReportService {
	
	private RadiologyReportRepository radiologyReportRepository;
	private PatientRepository patientRepository;
	private RadiologyOrderRepository orderRepository;

	public RadiologyReportServiceImpl(RadiologyReportRepository radiologyReportRepository,
			PatientRepository patientRepository, RadiologyOrderRepository orderRepository) {
		super();
		this.radiologyReportRepository = radiologyReportRepository;
		this.patientRepository = patientRepository;
		this.orderRepository = orderRepository;
	}

	@Override
	public RadiologyReport uploadReport(RadiologyReportRequest request) {

		RadiologyOrder radiologyOrder = orderRepository.findById(request.getRadiologyOrderId())
                        .orElseThrow(() ->new RuntimeException("Radiology order not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                        .orElseThrow(() ->new RuntimeException("Patient not found"));

        if (radiologyOrder.getPatient() == null
                || !radiologyOrder.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the radiology order");
        }
        
        RadiologyReport report = new RadiologyReport();

        report.setRadiologyOrder(radiologyOrder);
        report.setPatient(patient);
        report.setFindings(request.getFindings());
        report.setImpression(request.getImpression());
        report.setReportedBy(request.getReportedBy());
        report.setReportDate(LocalDateTime.now());
        report.setStatus("UPLOADED");
		
		return radiologyReportRepository.save(report);
	}

	@Override
	public RadiologyReport verifyReport(Long reportId, String verifiedBy) {

		RadiologyReport report =radiologyReportRepository.findById(reportId)
                        .orElseThrow(() ->new RuntimeException("Radiology report not found"));
		
		if (verifiedBy == null || verifiedBy.isBlank()) {
		    throw new IllegalArgumentException(
		            "Verifier name is required");
		}
		
		report.setVerifiedBy(verifiedBy);
        report.setStatus("VERIFIED");
        
		return radiologyReportRepository.save(report);
	}

	@Override
	public List<RadiologyReport> getPatientRadiologyHistory(Long patientId) {

		return radiologyReportRepository.findByPatientId(patientId);
	}

}
