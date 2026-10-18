package com.hospital.management.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.entity.Appointment;
import com.hospital.management.services.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
	
	private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody AppointmentRequest request) {

        return appointmentService.createAppointment(request);
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {

        return appointmentService.findAllAppointment();
    }

    @GetMapping("/{id}")
    public Appointment getAppointment(@PathVariable Long id) {

        return appointmentService.getAppointment(id);
    }

    @GetMapping("/patient/{patientId}") 
    public List<Appointment> getPatientAppointments( @PathVariable Long patientId) {

        return appointmentService.appointmetByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorAppointments(@PathVariable Long doctorId) {

        return appointmentService.appointmentByDoctorId(doctorId);
    }

    @GetMapping("/date/{date}")
    public List<Appointment> getAppointmentsByDate(@PathVariable LocalDate date) {

        return appointmentService.appointmentByDate(date);
    }

    @GetMapping("/department/{departmentId}")
    public List<Appointment> getDepartmentAppointments( @PathVariable Long departmentId) {

        return appointmentService.appointmentByDepartmentId(departmentId);
    }

    @PutMapping("/{id}")
    public Appointment updateAppointment( @PathVariable Long id, @RequestBody AppointmentRequest request) {

        return appointmentService.updateAppointment(id, request);
    }

    @PostMapping("/{id}/confirm")
    public Appointment confirmAppointment( @PathVariable Long id) {

        return appointmentService.confirmAppointment(id);
    }

    @PostMapping("/{id}/cancel")
    public Appointment cancelAppointment(@PathVariable Long id) {

        return appointmentService.cancelAppointment(id);
    }

    @PostMapping("/{id}/reschedule")
    public Appointment rescheduleAppointment( @PathVariable Long id,@RequestBody AppointmentRequest request) {

        return appointmentService.resheduleAppointment(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteAppointment( @PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return "Appointment deleted successfully";
    }

}
