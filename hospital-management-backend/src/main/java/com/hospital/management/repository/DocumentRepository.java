package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByPatientId(Long patientId);
}
