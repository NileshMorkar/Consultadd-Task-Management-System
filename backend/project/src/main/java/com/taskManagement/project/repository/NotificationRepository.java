package com.taskManagement.project.repository;

import com.taskManagement.project.model.Notification;
import com.taskManagement.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndReadFlagFalse(User user);
}
