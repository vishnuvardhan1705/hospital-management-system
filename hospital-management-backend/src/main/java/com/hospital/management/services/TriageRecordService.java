package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.TriageRecordRequest;
import com.hospital.management.entity.TriageRecord;

public interface TriageRecordService {
	
    public TriageRecord recordTriage(TriageRecordRequest request);

    public TriageRecord getTriageRecord(Long triageId);

    public List<TriageRecord> getTriageByEmergencyVisit(Long emergencyVisitId);

    public List<TriageRecord> getPatientTriageHistory(Long patientId);

}
