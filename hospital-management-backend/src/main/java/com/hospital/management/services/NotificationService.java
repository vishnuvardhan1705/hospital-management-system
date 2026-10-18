package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.NotificationRequest;
import com.hospital.management.entity.Notification;

public interface NotificationService {

    public Notification createNotification(NotificationRequest request);

    public List<Notification> getNotifications();

    public List<Notification> getUserNotifications(Long userId);

    public List<Notification> getPatientNotifications(Long patientId);

    public Notification markAsRead(Long notificationId);

    public Notification createEventNotification(NotificationRequest request, String notificationType);
}
