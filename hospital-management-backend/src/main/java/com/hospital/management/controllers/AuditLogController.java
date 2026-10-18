package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AuditLogRequest;
import com.hospital.management.entity.AuditLog;
import com.hospital.management.services.AuditLogService;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
	
	private AuditLogService auditLogService;

	public AuditLogController(AuditLogService auditLogService) {
		super();
		this.auditLogService = auditLogService;
	}
	
	@PostMapping
	public AuditLog createAuditLog(@RequestBody AuditLogRequest request) {

	    return auditLogService.createAuditLog(request);
	}

	@GetMapping
	public List<AuditLog> getAllAuditLogs() {

	    return auditLogService.getAllAuditLogs();
	}

	@GetMapping("/user/{userId}")
	public List<AuditLog> getUserActivity(@PathVariable Long userId) {

	    return auditLogService.getUserActivity(userId);
	}

	@GetMapping("/entity/{entityName}/{entityId}")
	public List<AuditLog> getEntityHistory(@PathVariable String entityName,@PathVariable Long entityId) {

	    return auditLogService.getEntityHistory(entityName, entityId);
	}

	@GetMapping("/patient/{patientId}/access-history")
	public List<AuditLog> getPatientAccessHistory( @PathVariable Long patientId) {

	    return auditLogService.getPatientRecordAccessHistory(patientId);
	}

}
