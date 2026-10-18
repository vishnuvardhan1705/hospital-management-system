package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.DocumentRequest;
import com.hospital.management.entity.Document;

public interface DocumentService {

    public Document createDocument(DocumentRequest request);

    public Document getDocument(Long documentId);

    public List<Document> getPatientDocuments(Long patientId);

    public Document updateDocumentStatus(Long documentId, String status);
}
