package com.hospital.management.services;

import com.hospital.management.repository.LabResultRepository;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.LabReportRequest;
import com.hospital.management.entity.LabOrder;
import com.hospital.management.entity.LabReport;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.LabOrderRepository;
import com.hospital.management.repository.LabReportRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class LabReportServiceImpl implements LabReportService {
	
	private LabReportRepository labReportRepository;
	private PatientRepository patientRepository;
	private LabOrderRepository labOrderRepository;

	public LabReportServiceImpl(LabReportRepository labReportRepository, PatientRepository patientRepository,
			LabOrderRepository labOrderRepository) {
		super();
		this.labReportRepository = labReportRepository;
		this.patientRepository = patientRepository;
		this.labOrderRepository = labOrderRepository;
	}

	@Override
	public LabReport generateReport(LabReportRequest request) {

		LabOrder labOrder = labOrderRepository.findById(request.getLabOrderId()).orElseThrow(() ->
                        		new RuntimeException("Lab order not found"));

        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
        						new RuntimeException("Patient not found"));

        if (labOrder.getPatient() == null
                || !labOrder.getPatient().getId().equals(patient.getId())) {
            throw new IllegalArgumentException(
                    "Patient does not match the laboratory order");
        }
        
        LabReport report = new LabReport();

        report.setLabOrder(labOrder);
        report.setPatient(patient);

        report.setReportDate(LocalDateTime.now());

        report.setReportNumber(
                "LAB-RPT-" + System.currentTimeMillis()
        );

        if (request.getVerifiedBy() != null) {
            report.setVerifiedBy(request.getVerifiedBy());
            report.setReportStatus("VERIFIED");
        } else {
            report.setReportStatus("GENERATED");
        }

		return labReportRepository.save(report);
	}

	@Override
	public LabReport getReport(Long reportId) {

		return labReportRepository.findById(reportId).orElseThrow(()->
								new RuntimeException("LabReport not found"));
	}

	@Override
	public List<LabReport> getReportByPatient(Long patientId) {

		return labReportRepository.findByPatientId(patientId);
	}

	@Override
	public List<LabReport> getReportByOrder(Long orderId) {

		return labReportRepository.findByLabOrderId(orderId);
	}

}
