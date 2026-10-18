package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.management.dto.NotificationRequest;
import com.hospital.management.entity.Notification;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.NotificationRepository;
import com.hospital.management.repository.PatientRepository;

@Service
public class NotificationServiceImpl implements NotificationService {
	
	private NotificationRepository notificationRepository;
	private PatientRepository patientRepository;

	public NotificationServiceImpl(NotificationRepository notificationRepository, PatientRepository patientRepository) {
		super();
		this.notificationRepository = notificationRepository;
		this.patientRepository = patientRepository;
	}

	@Override
	public Notification createNotification(NotificationRequest request) {
        if (request.getNotificationType() == null || request.getNotificationType().isBlank()) {
            throw new IllegalArgumentException("Notification type is required");
        }

        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Notification title is required");
        }

        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Notification message is required");
        }

        Notification notification = new Notification();

        notification.setUserId(request.getUserId());
        notification.setNotificationType( request.getNotificationType());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setStatus("UNREAD");
        notification.setCreatedAt(LocalDateTime.now());

        if (request.getPatientId() != null) {
            Patient patient = patientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new RuntimeException("Patient not found with id: "+ request.getPatientId()));

            notification.setPatient(patient);
        }

        return notificationRepository.save(notification);
	}

	@Override
	public List<Notification> getNotifications() {
		
		return notificationRepository.findAll();
	}

	@Override
	public List<Notification> getUserNotifications(Long userId) {

		return notificationRepository.findByUserId(userId);
	}

	@Override
	public List<Notification> getPatientNotifications(Long patientId) {

		return notificationRepository.findByPatientId(patientId);
	}

	@Override
	public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));

        if (!"READ".equals(notification.getStatus())) {
            notification.setStatus("READ");
            notification.setReadAt(LocalDateTime.now());

            return notificationRepository.save(notification);
        }

        return notification;
	}

	@Override
	public Notification createEventNotification(NotificationRequest request, String notificationType) {
        request.setNotificationType(notificationType);

        return createNotification(request);
	}

}
