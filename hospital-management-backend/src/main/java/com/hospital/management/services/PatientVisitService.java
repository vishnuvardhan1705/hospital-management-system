package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.PatientVisitRequest;
import com.hospital.management.entity.PatientVisit;

public interface PatientVisitService {

	public PatientVisit createVist(PatientVisitRequest request);
	public List<PatientVisit> findAllVisits();
	public PatientVisit getVisit(Long visitId);
	public PatientVisit checkIn(Long visitId);
}
