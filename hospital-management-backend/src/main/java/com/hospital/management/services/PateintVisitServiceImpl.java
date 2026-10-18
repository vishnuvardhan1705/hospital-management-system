package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.PatientVisitRequest;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PatientVisit;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PatientVisitRepository;

@Service
public class PateintVisitServiceImpl implements PatientVisitService {
	
	private PatientVisitRepository patientVisitRepository;
	
	private PatientRepository patientRepository;
	
	private DoctorRepository doctorRepository;
	
	private DepartmentRepository departmentRepository;
	
	private AppointmentRepository appointmentRepository;
	
	
	
	public PateintVisitServiceImpl(PatientVisitRepository patientVisitRepository, PatientRepository patientRepository,
			DoctorRepository doctorRepository, DepartmentRepository departmentRepository,
			AppointmentRepository appointmentRepository) {
		this.patientVisitRepository = patientVisitRepository;
		this.patientRepository = patientRepository;
		this.doctorRepository = doctorRepository;
		this.departmentRepository = departmentRepository;
		this.appointmentRepository = appointmentRepository;
	}

	@Override
	public PatientVisit createVist(PatientVisitRequest request) {
		Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() ->
                        new RuntimeException("Department not found"));
        
        Appointment appointment = null;
        
        if(request.getAppointmentId() != null) {
        	appointment = appointmentRepository.findById(request.getAppointmentId()).orElseThrow(()->
        					new RuntimeException("Appointment not Found"));
        	if(!appointment.getPatient().getId().equals(request.getPatientId())) {
        		throw new RuntimeException("Appointment does not belong to this patient");
        	}
        }
        
        PatientVisit visit = new PatientVisit();
        visit.setPatient(patient);
        visit.setAppointment(appointment);
        visit.setDoctor(doctor);
        visit.setDepartment(department);
        visit.setVisitType(request.getVisitType());
        visit.setVisitDate(LocalDate.now());

        visit.setStatus("SCHEDULED");

        return patientVisitRepository.save(visit);
        
	}

	@Override
	public List<PatientVisit> findAllVisits() {
		return patientVisitRepository.findAll();
	}

	@Override
	public PatientVisit getVisit(Long visitId) {
		return patientVisitRepository.findById(visitId).orElseThrow(()->
						new RuntimeException("Visit not found"));
	}

	@Override
	public PatientVisit checkIn(Long visitId) {
		PatientVisit visit = getVisit(visitId);

        if ("CHECKED_IN".equals(visit.getStatus())) {

            throw new RuntimeException("Patient is already checked in");
        }

        if ("COMPLETED".equals(visit.getStatus())) {

            throw new RuntimeException("Completed visit cannot be checked in");
        }

        visit.setStatus("CHECKED_IN");

        return patientVisitRepository.save(visit);
	}

}
