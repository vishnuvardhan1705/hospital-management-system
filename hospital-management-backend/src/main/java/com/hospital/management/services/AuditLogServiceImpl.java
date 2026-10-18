package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.AuditLogRequest;
import com.hospital.management.entity.AuditLog;
import com.hospital.management.repository.AuditLogRepository;

@Service
public class AuditLogServiceImpl implements AuditLogService {

	private AuditLogRepository auditLogRepository;
	
	public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
		super();
		this.auditLogRepository = auditLogRepository;
	}

	@Override
	public AuditLog createAuditLog(AuditLogRequest request) {
        if (request.getAction() == null || request.getAction().isBlank()) {
            throw new IllegalArgumentException("Action is required");
        }

        if (request.getEntityName() == null || request.getEntityName().isBlank()) {
            throw new IllegalArgumentException("Entity name is required");
        }

        AuditLog log = new AuditLog();

        log.setUserId(request.getUserId());
        log.setAction(request.getAction());
        log.setEntityName(request.getEntityName());
        log.setEntityId(request.getEntityId());
        log.setOldValue(request.getOldValue());
        log.setNewValue(request.getNewValue());
        log.setIpAddress(request.getIpAddress());

        return auditLogRepository.save(log);
	}

	@Override
	public List<AuditLog> getAllAuditLogs() {

		return auditLogRepository.findAll();
	}

	@Override
	public List<AuditLog> getUserActivity(Long userId) {

		return auditLogRepository.findByUserId(userId);
	}

	@Override
	public List<AuditLog> getEntityHistory(String entityName, Long entityId) {

		return auditLogRepository.findByEntityNameAndEntityId(entityName, entityId);
	}

	@Override
	public List<AuditLog> getPatientRecordAccessHistory(Long patientId) {

		return auditLogRepository.findByEntityNameAndEntityIdAndAction( "Patient", patientId, "VIEW");
	}

}
