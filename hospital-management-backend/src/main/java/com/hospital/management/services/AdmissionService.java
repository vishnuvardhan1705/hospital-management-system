package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.AdmissionRequest;
import com.hospital.management.entity.Admission;

public interface AdmissionService {

	public Admission createAdmission(AdmissionRequest request);
	public Admission getAdmission(Long admissionId);
	public Admission updateAdmission(Long admissionId,AdmissionRequest request);
	public Admission approveAdmission(Long admissionId);
	public List<Admission> getActiveAdmissions();
	public List<Admission> getAdmissionByPatient(Long patientId);
	public Admission assignDoctor(Long admissionId,Long doctorId);
	public Admission assignWard(Long admissionId,Long wardId);
}
