package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.AuditLogRequest;
import com.hospital.management.entity.AuditLog;

public interface AuditLogService {

    public AuditLog createAuditLog(AuditLogRequest request);

    public List<AuditLog> getAllAuditLogs();

    public List<AuditLog> getUserActivity(Long userId);

    public List<AuditLog> getEntityHistory(String entityName, Long entityId);

    public List<AuditLog> getPatientRecordAccessHistory(Long patientId);
}
