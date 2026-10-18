package com.hospital.management.services;

import java.time.LocalDate;
import java.util.List;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.entity.Appointment;

public interface AppointmentService {
	
	public Appointment createAppointment(AppointmentRequest request);
	
	public Appointment getAppointment(Long id);
	public List<Appointment> findAllAppointment();
	public List<Appointment> appointmetByPatientId(Long patientId);
	public List<Appointment> appointmentByDoctorId(Long doctorId);
	public List<Appointment> appointmentByDepartmentId(Long departmentId);
	public List<Appointment> appointmentByDate(LocalDate date);
	
	public Appointment updateAppointment(Long id, AppointmentRequest request);
	public Appointment confirmAppointment(Long id);
	public Appointment cancelAppointment(Long id);
	public Appointment resheduleAppointment(Long id,AppointmentRequest request);
	public void deleteAppointment(Long id);

}
