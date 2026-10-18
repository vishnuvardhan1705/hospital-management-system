package com.hospital.management.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.DoctorRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {
	
	private AppointmentRepository appointmentRepository;
	private DoctorRepository doctorRepository;
	private PatientRepository patientRepository;
	private DepartmentRepository departmentRepository;

	public AppointmentServiceImpl(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository,
			PatientRepository patientRepository, DepartmentRepository departmentRepository) {
		super();
		this.appointmentRepository = appointmentRepository;
		this.doctorRepository = doctorRepository;
		this.patientRepository = patientRepository;
		this.departmentRepository = departmentRepository;
	}

	@Override
	public Appointment createAppointment(AppointmentRequest request) {
	    Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
	                    new RuntimeException("Patient not found with id: " + request.getPatientId()));

	    Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
	                    new RuntimeException("Doctor not found with id: " + request.getDoctorId()));

	    Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() ->
	                    new RuntimeException("Department not found with id: " + request.getDepartmentId()));

	    validateTime(request);

	    List<Appointment> overlappingAppointments =
	            appointmentRepository.findOverlappingAppointments(
	                    request.getDoctorId(),
	                    request.getAppointmentDate(),
	                    request.getStartTime(),
	                    request.getEndTime()
	            );

	    if (!overlappingAppointments.isEmpty()) {
	        throw new RuntimeException("Doctor already has an appointment during this time"
	        );
	    }

	    Appointment appointment = new Appointment();

	    appointment.setPatient(patient);
	    appointment.setDoctor(doctor);
	    appointment.setDepartment(department);

	    appointment.setAppointmentDate(request.getAppointmentDate());
	    appointment.setStartTime(request.getStartTime());
	    appointment.setEndTime(request.getEndTime());
	    appointment.setAppointmentType(request.getAppointmentType());
	    appointment.setReason(request.getReason());

	    appointment.setStatus("SCHEDULED");
	    appointment.setCreatedBy("SYSTEM");
	    appointment.setCreatedAt(LocalDateTime.now());

	    appointment.setAppointmentNumber(
	            "APT-" + java.util.UUID.randomUUID()
	                    .toString()
	                    .substring(0, 8)
	                    .toUpperCase());

	    return appointmentRepository.save(appointment);
	}

	@Override
	public Appointment getAppointment(Long id) {
		return appointmentRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Appointment not found with id: "+ id));
	}

	@Override
	public List<Appointment> findAllAppointment() {
		return appointmentRepository.findAll();
	}

	@Override
	public List<Appointment> appointmetByPatientId(Long patientId) {
		return appointmentRepository.findByPatientId(patientId);
	}

	@Override
	public List<Appointment> appointmentByDoctorId(Long doctorId) {
		return appointmentRepository.findByDoctorId(doctorId);
	}

	@Override
	public List<Appointment> appointmentByDepartmentId(Long departmentId) {
		return appointmentRepository.findByDepartmentId(departmentId);
	}

	@Override
	public List<Appointment> appointmentByDate(LocalDate date) {
		return appointmentRepository.findByAppointmentDate(date);
	}

	@Override
	public Appointment updateAppointment(Long id, AppointmentRequest request) {
		Appointment appointment = getAppointment(id);

        validateTime(request);

        List<Appointment> overlappingAppointments =
                appointmentRepository.findOverlappingAppointmentsForUpdate(
                        request.getDoctorId(),
                        request.getAppointmentDate(),
                        request.getStartTime(),
                        request.getEndTime(),
                        id
                );

        if (!overlappingAppointments.isEmpty()) {
            throw new RuntimeException(
                    "Doctor already has an appointment during this time"
            );
        }

        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() ->
                        new RuntimeException("Department not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setDepartment(department);

        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setReason(request.getReason());

        return appointmentRepository.save(appointment);
	}

	@Override
	public Appointment confirmAppointment(Long id) {
		Appointment appointment = getAppointment(id);

        if ("CANCELLED".equals(appointment.getStatus())) {
            throw new RuntimeException(
                    "Cancelled appointment cannot be confirmed"
            );
        }

        appointment.setStatus("CONFIRMED");

        return appointmentRepository.save(appointment);
	}

	@Override
	public Appointment cancelAppointment(Long id) {
		Appointment appointment = getAppointment(id);

        if ("COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException(
                    "Completed appointment cannot be cancelled"
            );
        }

        appointment.setStatus("CANCELLED");

        return appointmentRepository.save(appointment);
	}

	@Override
	public Appointment resheduleAppointment(Long id,AppointmentRequest request) {
		 Appointment appointment = getAppointment(id);

	        validateTime(request);

	        List<Appointment> overlappingAppointments =
	                appointmentRepository.findOverlappingAppointmentsForUpdate(
	                        request.getDoctorId(),
	                        request.getAppointmentDate(),
	                        request.getStartTime(),
	                        request.getEndTime(),
	                        id
	                );

	        if (!overlappingAppointments.isEmpty()) {
	            throw new RuntimeException("Doctor already has an appointment during this time");
	        }

	        Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElseThrow(() ->
	                        new RuntimeException("Doctor not found"));

	        Department department = departmentRepository.findById(request.getDepartmentId()).orElseThrow(() ->
	                        new RuntimeException("Department not found"));

	        appointment.setDoctor(doctor);
	        appointment.setDepartment(department);
	        appointment.setAppointmentDate(request.getAppointmentDate());
	        appointment.setStartTime(request.getStartTime());
	        appointment.setEndTime(request.getEndTime());
	        appointment.setAppointmentType(request.getAppointmentType());
	        appointment.setReason(request.getReason());

	        appointment.setStatus("SCHEDULED");

	        return appointmentRepository.save(appointment);
	}

	@Override
	public void deleteAppointment(Long id) {
		Appointment appointment = getAppointment(id);

        appointmentRepository.delete(appointment);

	}
	
	private void validateTime(AppointmentRequest request) {

        if (request.getStartTime() == null ||
                request.getEndTime() == null) {

            throw new RuntimeException("Start time and end time are required");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {

            throw new RuntimeException("End time must be after start time");
        }
    }

}
