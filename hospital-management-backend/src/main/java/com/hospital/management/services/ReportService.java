package com.hospital.management.services;

import com.hospital.management.dto.ReportResponse;

public interface ReportService {

    public ReportResponse getPatientReport();

    public ReportResponse getAppointmentReport();

    public ReportResponse getFinancialReport();

    public ReportResponse getPharmacyReport();

    public ReportResponse getLaboratoryReport();

    public ReportResponse getAdmissionReport();
}
