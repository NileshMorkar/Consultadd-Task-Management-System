package com.taskManagement.project.service;

import com.taskManagement.project.model.Notification;
import com.taskManagement.project.model.Task;
import com.taskManagement.project.model.User;
import com.taskManagement.project.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Slf4j
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

    public void notifyUsers(Set<User> recipients, Task task, String message) {
        for (User user : recipients) {
            Notification notification = Notification.builder()
                    .user(user)
                    .task(task)
                    .message(message)
                    .type("INFO") // or COMMENT / TASK_ASSIGNED etc.
                    .readFlag(false)
                    .build();
            log.debug("notification on assign users", notification);
            notificationRepository.save(notification);
        }
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }
}
