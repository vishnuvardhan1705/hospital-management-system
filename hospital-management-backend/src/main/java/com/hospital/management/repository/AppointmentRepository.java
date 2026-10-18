package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hospital.management.entity.Appointment;
import java.time.LocalDate;
import java.time.LocalTime;


public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
	
	List<Appointment> findByPatientId(Long patientId);
	List<Appointment> findByDoctorId(Long doctorId);
	List<Appointment> findByDepartmentId(Long departmentId);
	List<Appointment> findByAppointmentDate(LocalDate appointmentDate);
	
	@Query("""
		    SELECT a FROM Appointment a
		    WHERE a.doctor.id = :doctorId
		      AND a.appointmentDate = :appointmentDate
		      AND a.startTime < :endTime
		      AND a.endTime > :startTime
		      AND a.status <> 'CANCELLED'
		""")
		List<Appointment> findOverlappingAppointments(
		        @Param("doctorId") Long doctorId,
		        @Param("appointmentDate") LocalDate appointmentDate,
		        @Param("startTime") LocalTime startTime,
		        @Param("endTime") LocalTime endTime
		);

		@Query("""
		    SELECT a FROM Appointment a
		    WHERE a.doctor.id = :doctorId
		      AND a.appointmentDate = :appointmentDate
		      AND a.startTime < :endTime
		      AND a.endTime > :startTime
		      AND a.id <> :appointmentId
		      AND a.status <> 'CANCELLED'
		""")
		List<Appointment> findOverlappingAppointmentsForUpdate(
		        @Param("doctorId") Long doctorId,
		        @Param("appointmentDate") LocalDate appointmentDate,
		        @Param("startTime") LocalTime startTime,
		        @Param("endTime") LocalTime endTime,
		        @Param("appointmentId") Long appointmentId
		);
}
