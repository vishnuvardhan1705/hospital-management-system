package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.AdmissionRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Ward;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.WardRepository;

@Service
public class AdmissionServiceImpl implements AdmissionService {

	private AdmissionRepository admissionRepository;
	private PatientRepository patientRepository;
	private DoctorRepository doctorRepository;
	private WardRepository wardRepository;     
	private DepartmentRepository departmentRepository;
	
	public AdmissionServiceImpl(AdmissionRepository admissionRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository, WardRepository wardRepository,DepartmentRepository departmentRepository) {
		super();
		this.admissionRepository = admissionRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.wardRepository = wardRepository;
		this.departmentRepository = departmentRepository;
	}

	@Override
	public Admission createAdmission(AdmissionRequest request) {
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                				new RuntimeException("Patient not found"));

        Admission admission = new Admission();

        admission.setPatient(patient);

        admission.setAdmissionDate(request.getAdmissionDate() != null ? request.getAdmissionDate() : LocalDate.now());

        admission.setAdmissionReason(request.getAdmissionReason());

        admission.setDiagnosis(request.getDiagnosis());

        admission.setExpectedDischargeDate(request.getExpectedDischargeDate());

        admission.setStatus(request.getStatus() != null? request.getStatus(): "REQUESTED");

        admission.setAdmissionNumber("TEMP");
        Admission saved =admissionRepository.save(admission);

        saved.setAdmissionNumber("ADM-" + String.format( "%05d",saved.getId()));

        return admissionRepository.save(saved);
	}

	@Override
	public Admission getAdmission(Long admissionId) {

		return admissionRepository.findById(admissionId).orElseThrow(()->
								new RuntimeException("Admission not found"));
	}

	@Override
	public Admission updateAdmission(Long admissionId, AdmissionRequest request) {
		Admission admission =getAdmission(admissionId);

        if (request.getPatientId() != null) {

            Patient patient = patientRepository.findById(request.getPatientId()) .orElseThrow(() ->
                            new RuntimeException("Patient not found"));

            admission.setPatient(patient);
        }

        if (request.getDoctorId() != null) {

            Doctor doctor =doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                            new RuntimeException("Doctor not found"));

            admission.setDoctor(doctor);
        }

        if (request.getDepartmentId() != null) {

            Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() ->
                            new RuntimeException("Department not found"));

            admission.setDepartment(department);
        }

        if (request.getWardId() != null) {

            Ward ward = wardRepository.findById(request.getWardId()).orElseThrow(() ->
                            new RuntimeException("Ward not found"));

            admission.setWard(ward);
        }

        if (request.getAdmissionDate() != null) {
            admission.setAdmissionDate(request.getAdmissionDate());
        }

        if (request.getAdmissionReason() != null) {
            admission.setAdmissionReason(request.getAdmissionReason());
        }

        if (request.getDiagnosis() != null) {
            admission.setDiagnosis(request.getDiagnosis());
        }

        if (request.getExpectedDischargeDate() != null) {
            admission.setExpectedDischargeDate(
                    request.getExpectedDischargeDate());
        }

        if (request.getActualDischargeDate() != null) {
            admission.setActualDischargeDate(
                    request.getActualDischargeDate());
        }

        if (request.getStatus() != null) {
            admission.setStatus(request.getStatus());
        }

        return admissionRepository.save(admission);
	}

	@Override
	public Admission approveAdmission(Long admissionId) {
	    Admission admission = getAdmission(admissionId);

	    if (!"REQUESTED".equals(admission.getStatus())) {
	        throw new IllegalArgumentException(
	                "Only requested admissions can be approved");
	    }

	    admission.setStatus("APPROVED");
	    return admissionRepository.save(admission);
	}

	@Override
	public List<Admission> getActiveAdmissions() {
		
		return admissionRepository.findByStatus("APPROVED");
	}

	@Override
	public List<Admission> getAdmissionByPatient(Long patientId) {

		return admissionRepository.findByPatientId(patientId);
	}

	@Override
	public Admission assignDoctor(Long admissionId, Long doctorId) {
		Admission admission = getAdmission(admissionId);

        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        admission.setDoctor(doctor);

        return admissionRepository.save(admission);
	}

	@Override
	public Admission assignWard(Long admissionId, Long wardId) {
        Admission admission =getAdmission(admissionId);

        Ward ward = wardRepository.findById(wardId).orElseThrow(() ->
                        new RuntimeException("Ward not found"));

        admission.setWard(ward);

        return admissionRepository.save(admission);
	}

}
