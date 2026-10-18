package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.NotificationRequest;
import com.hospital.management.entity.Notification;
import com.hospital.management.services.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	private NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		super();
		this.notificationService = notificationService;
	}
	
	@PostMapping
	public Notification createNotification(@RequestBody NotificationRequest request) {

	    return notificationService.createNotification(request);
	}

	@GetMapping
	public List<Notification> getNotifications() {

	    return notificationService.getNotifications();
	}

	@GetMapping("/user/{userId}")
	public List<Notification> getUserNotifications(@PathVariable Long userId) {

	    return notificationService.getUserNotifications(userId);
	}

	@GetMapping("/patient/{patientId}")
	public List<Notification> getPatientNotifications(@PathVariable Long patientId) {

	    return notificationService.getPatientNotifications(patientId);
	}

	@PatchMapping("/{notificationId}/read")
	public Notification markAsRead(@PathVariable Long notificationId) {

	    return notificationService.markAsRead(notificationId);
	}

	@PostMapping("/appointment")
	public Notification sendAppointmentNotification(@RequestBody NotificationRequest request) {

	    return notificationService.createEventNotification(request, "APPOINTMENT");
	}

	@PostMapping("/lab")
	public Notification sendLabNotification(@RequestBody NotificationRequest request) {

	    return notificationService.createEventNotification( request, "LAB");
	}

	@PostMapping("/payment")
	public Notification sendPaymentNotification(@RequestBody NotificationRequest request) {

	    return notificationService.createEventNotification( request, "PAYMENT");
	}

	@PostMapping("/follow-up")
	public Notification sendFollowUpNotification( @RequestBody NotificationRequest request) {

	    return notificationService.createEventNotification(request, "FOLLOW_UP");
	}
}
