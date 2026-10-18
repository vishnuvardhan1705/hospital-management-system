package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByEntityNameAndEntityId(String entityName, Long entityId);

    List<AuditLog> findByEntityNameAndEntityIdAndAction(String entityName, Long entityId, String action);
}
