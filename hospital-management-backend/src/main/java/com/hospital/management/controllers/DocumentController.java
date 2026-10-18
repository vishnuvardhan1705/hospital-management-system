package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.DocumentRequest;
import com.hospital.management.entity.Document;
import com.hospital.management.services.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

	private DocumentService documentService;

	public DocumentController(DocumentService documentService) {
		super();
		this.documentService = documentService;
	}
	
	@PostMapping
	public Document createDocument(@RequestBody DocumentRequest request) {

	    return documentService.createDocument(request);
	}

	@GetMapping("/{documentId}")
	public Document getDocument(@PathVariable Long documentId) {

	    return documentService.getDocument(documentId);
	}

	@GetMapping("/patient/{patientId}")
	public List<Document> getPatientDocuments(@PathVariable Long patientId) {

	    return documentService.getPatientDocuments(patientId);
	}

	@PatchMapping("/{documentId}/status")
	public Document updateDocumentStatus( @PathVariable Long documentId, @RequestParam String status) {

	    return documentService.updateDocumentStatus(documentId, status);
	}
}
