package com.taskManagement.project.service;

import com.taskManagement.project.model.Notification;
import com.taskManagement.project.model.User;
import com.taskManagement.project.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getUnread(User user) {
        return notificationRepository.findByUserAndReadFlagFalse(user);
    }

    public Notification markRead(Notification notification, boolean readFlag) {
        notification.setReadFlag(readFlag);
        return notificationRepository.save(notification);
    }

    public void markAllRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserAndReadFlagFalse(user);
        notifications.forEach(n -> n.setReadFlag(true));
        notificationRepository.saveAll(notifications);
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
}
