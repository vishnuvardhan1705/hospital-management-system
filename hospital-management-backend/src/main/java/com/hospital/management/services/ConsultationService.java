package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.ConsultationRequest;
import com.hospital.management.entity.Consultation;

public interface ConsultationService {
	
	public Consultation createConsultation(ConsultationRequest request);
	public Consultation getConsultation(Long consultationId);
	public List<Consultation> getPatientConsultations(Long patientId);
    public Consultation updateConsultation(Long consultationId, ConsultationRequest request);

}
