package com.taskManagement.project.controller;

import com.taskManagement.project.config.SecurityUtils;
import com.taskManagement.project.dto.MarkReadRequestDto;
import com.taskManagement.project.dto.NotificationDto;
import com.taskManagement.project.model.Notification;
import com.taskManagement.project.model.User;
import com.taskManagement.project.service.NotificationService;
import com.taskManagement.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getUnread(@RequestParam(defaultValue = "true") boolean unread) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();
        List<Notification> notifications = unread ?
                notificationService.getUnread(user) : user.getNotifications().stream().toList();

        return ResponseEntity.ok(notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList()));
    }

    @PostMapping("/{id}/mark-read")
    public ResponseEntity<?> markRead(@PathVariable Long id, @RequestBody MarkReadRequestDto dto) {
        Notification notif = notificationService
                .getUnread(userService.findById(1L).orElseThrow())
                .stream().filter(n -> n.getId().equals(id)).findFirst()
                .orElseThrow(() -> new RuntimeException("Notification not found or already read"));
        notificationService.markRead(notif, dto.isReadFlag());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllRead() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();

        notificationService.markAllRead(user);
        return ResponseEntity.ok().build();
    }

    private NotificationDto toDto(Notification n) {
        return NotificationDto.builder()
                .id(n.getId())
                .message(n.getMessage())
                .type(n.getType())
                .readFlag(n.isReadFlag())
                .createdAt(n.getCreatedAt())
                .taskId(n.getTask() != null ? n.getTask().getId() : null)
                .build();
    }
}
