package com.hospital.management.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.DocumentRequest;
import com.hospital.management.entity.Document;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.DocumentRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class DocumentServiceImpl implements DocumentService {
	
	private DocumentRepository documentRepository;
	private PatientRepository patientRepository;

	public DocumentServiceImpl(DocumentRepository documentRepository, PatientRepository patientRepository) {
		super();
		this.documentRepository = documentRepository;
		this.patientRepository = patientRepository;
	}

	@Override
	public Document createDocument(DocumentRequest request) {
        if (request.getPatientId() == null) {
            throw new IllegalArgumentException("Patient ID is required");
        }

        if (request.getDocumentType() == null || request.getDocumentType().isBlank()) {
            throw new IllegalArgumentException("Document type is required");
        }

        if (request.getFileName() == null || request.getFileName().isBlank()) {
            throw new IllegalArgumentException("File name is required");
        }

        if (request.getFileLocation() == null || request.getFileLocation().isBlank()) {
            throw new IllegalArgumentException("File location is required");
        }

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + request.getPatientId()));

        Document document = new Document();
        document.setPatient(patient);
        document.setDocumentType(request.getDocumentType());
        document.setFileName(request.getFileName());
        document.setFileLocation(request.getFileLocation());
        document.setUploadedBy(request.getUploadedBy());
        document.setStatus("ACTIVE");

        return documentRepository.save(document);
	}

	@Override
	public Document getDocument(Long documentId) {

		return documentRepository.findById(documentId).orElseThrow(() ->
						new RuntimeException("Document not found"));
	}

	@Override
	public List<Document> getPatientDocuments(Long patientId) {

		return documentRepository.findByPatientId(patientId);
	}

	@Override
	public Document updateDocumentStatus(Long documentId, String status) {
        if (status == null || (!status.equalsIgnoreCase("ACTIVE")&& !status.equalsIgnoreCase("INACTIVE"))) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }

        Document document = getDocument(documentId);
        document.setStatus(status.toUpperCase());

        return documentRepository.save(document);
	}

}
