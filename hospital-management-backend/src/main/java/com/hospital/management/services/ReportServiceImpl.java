package com.hospital.management.services;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.ReportResponse;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.BedRepository;
import com.hospital.management.repository.BillRepository;
import com.hospital.management.repository.InsuranceClaimRepository;
import com.hospital.management.repository.LabOrderRepository;
import com.hospital.management.repository.LabReportRepository;
import com.hospital.management.repository.MedicineBatchRepository;
import com.hospital.management.repository.MedicineRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PatientVisitRepository;
import com.hospital.management.repository.PaymentRepository;
import com.hospital.management.repository.PharmacyTransactionRepository;
import com.hospital.management.repository.RefundRepository;

@Service
public class ReportServiceImpl implements ReportService {

    private  PatientRepository patientRepository;
    private  PatientVisitRepository patientVisitRepository;
    private  AppointmentRepository appointmentRepository;
    private  BillRepository billRepository;
    private  PaymentRepository paymentRepository;
    private  RefundRepository refundRepository;
    private  InsuranceClaimRepository insuranceClaimRepository;
    private  MedicineRepository medicineRepository;
    private  MedicineBatchRepository medicineBatchRepository;
    private  PharmacyTransactionRepository pharmacyTransactionRepository;
    private  LabOrderRepository labOrderRepository;
    private  LabReportRepository labReportRepository;
    private  AdmissionRepository admissionRepository;
    private  BedRepository bedRepository;
    
	public ReportServiceImpl(PatientRepository patientRepository, PatientVisitRepository patientVisitRepository,
			AppointmentRepository appointmentRepository, BillRepository billRepository,
			PaymentRepository paymentRepository, RefundRepository refundRepository,
			InsuranceClaimRepository insuranceClaimRepository, MedicineRepository medicineRepository,
			MedicineBatchRepository medicineBatchRepository,
			PharmacyTransactionRepository pharmacyTransactionRepository, LabOrderRepository labOrderRepository,
			LabReportRepository labReportRepository, AdmissionRepository admissionRepository,
			BedRepository bedRepository) {
		super();
		this.patientRepository = patientRepository;
		this.patientVisitRepository = patientVisitRepository;
		this.appointmentRepository = appointmentRepository;
		this.billRepository = billRepository;
		this.paymentRepository = paymentRepository;
		this.refundRepository = refundRepository;
		this.insuranceClaimRepository = insuranceClaimRepository;
		this.medicineRepository = medicineRepository;
		this.medicineBatchRepository = medicineBatchRepository;
		this.pharmacyTransactionRepository = pharmacyTransactionRepository;
		this.labOrderRepository = labOrderRepository;
		this.labReportRepository = labReportRepository;
		this.admissionRepository = admissionRepository;
		this.bedRepository = bedRepository;
	}

	@Override
	public ReportResponse getPatientReport() {
        ReportResponse report = new ReportResponse("Patient Report");

        report.add("totalPatients", patientRepository.count());
        report.add("totalVisits", patientVisitRepository.count());

        return report;
	}

	@Override
	public ReportResponse getAppointmentReport() {
        ReportResponse report = new ReportResponse("Appointment Report");

        var appointments = appointmentRepository.findAll();
        LocalDate today = LocalDate.now();

        report.add("totalAppointments", appointments.size());

        report.add("todaysAppointments",appointments.stream().filter(a -> a.getAppointmentDate() != null)
                        .filter(a -> a.getAppointmentDate().equals(today)).count());

        report.add("completedAppointments",appointments.stream()
                        .filter(a -> "COMPLETED".equalsIgnoreCase(a.getStatus())).count());

        report.add("cancelledAppointments", appointments.stream()
        				.filter(a -> "CANCELLED".equalsIgnoreCase(a.getStatus())).count());

        report.add("noShowAppointments",appointments.stream()
                        .filter(a -> "NO_SHOW".equalsIgnoreCase(a.getStatus())).count());

        report.add("appointmentsByDoctor",appointments.stream().filter(a -> a.getDoctor() != null)
                        .collect(Collectors.groupingBy(a -> a.getDoctor().getId(),Collectors.counting())));

        return report;
	}

	@Override
	public ReportResponse getFinancialReport() {
        ReportResponse report = new ReportResponse("Financial Report");

        var bills = billRepository.findAll();
        var payments = paymentRepository.findAll();
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.now();

        report.add("totalBills", bills.size());

        report.add("outstandingAmount", bills.stream().mapToDouble(b -> b.getOutstandingAmount() == null
                                ? 0.0 : b.getOutstandingAmount()).sum());

        report.add("dailyRevenue",payments.stream().filter(p -> p.getPaymentDate() != null).filter(p -> p.getPaymentDate().toLocalDate().equals(today))
                        .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus())).mapToDouble(p -> p.getAmount() == null
                                ? 0.0 : p.getAmount()).sum());

        report.add("monthlyRevenue",payments.stream().filter(p -> p.getPaymentDate() != null).filter(p -> YearMonth.from(p.getPaymentDate()).equals(currentMonth))
                        .filter(p -> "SUCCESS".equalsIgnoreCase(p.getStatus()))
                        .mapToDouble(p -> p.getAmount() == null? 0.0 : p.getAmount()).sum());

        report.add("totalRefundRecords", refundRepository.count());
        report.add("totalInsuranceClaims", insuranceClaimRepository.count());

        return report;
	}

	@Override
	public ReportResponse getPharmacyReport() {
        ReportResponse report = new ReportResponse("Pharmacy Report");

        var medicines = medicineRepository.findAll();
        var batches = medicineBatchRepository.findAll();
        LocalDate today = LocalDate.now();

        report.add("totalMedicines", medicines.size());

        report.add("currentStockQuantity",batches.stream()
                        .mapToLong(b -> b.getQuantity() == null ? 0L : b.getQuantity())
                        .sum());

        report.add("expiredBatches", batches.stream().filter(b -> b.getExpiryDate() != null)
                        .filter(b -> b.getExpiryDate().isBefore(today)).count());

        report.add("lowStockMedicineCount", medicines.stream().filter(m -> m.getReorderLevel() != null)
                        .filter(m -> { long stock = batches.stream()
                                    .filter(b -> b.getMedicine() != null)
                                    .filter(b -> b.getMedicine().getId()
                                            .equals(m.getId()))
                                    .filter(b -> b.getExpiryDate() == null
                                            || !b.getExpiryDate().isBefore(today))
                                    .mapToLong(b -> b.getQuantity() == null
                                            ? 0L : b.getQuantity())
                                    .sum();

                            return stock <= m.getReorderLevel();
                        })
                        .count());

        report.add("totalPharmacyTransactions",pharmacyTransactionRepository.count());

        return report;
	}

	@Override
	public ReportResponse getLaboratoryReport() {
        ReportResponse report = new ReportResponse("Laboratory Report");

        var orders = labOrderRepository.findAll();
        var reports = labReportRepository.findAll();

        report.add("totalLabOrders", orders.size());

        report.add("pendingLabOrders",orders.stream()
                        .filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()))
                        .count());

        report.add("completedLabOrders", orders.stream()
                        .filter(o -> "COMPLETED".equalsIgnoreCase(o.getStatus()))
                        .count());

        report.add("totalLabReports", reports.size());

        report.add("completedReports", reports.stream()
                        .filter(r -> "COMPLETED".equalsIgnoreCase(r.getReportStatus()))
                        .count());

        return report;
	}

	@Override
	public ReportResponse getAdmissionReport() {
		
        ReportResponse report = new ReportResponse("Admission Report");

        var admissions = admissionRepository.findAll();
        var beds = bedRepository.findAll();

        report.add("totalAdmissions", admissions.size());

        report.add("currentPatients", admissions.stream()
                        .filter(a -> "ADMITTED".equalsIgnoreCase(a.getStatus()))
                        .count());

        report.add("dischargedPatients", admissions.stream()
                        .filter(a -> "DISCHARGED".equalsIgnoreCase(a.getStatus()))
                        .count());

        report.add("totalBeds", beds.size());

        report.add("availableBeds", beds.stream()
                        .filter(b -> "AVAILABLE".equalsIgnoreCase(b.getStatus()))
                        .count());

        report.add("occupiedBeds", beds.stream()
                        .filter(b -> "OCCUPIED".equalsIgnoreCase(b.getStatus()))
                        .count());

        return report;
	}

}
