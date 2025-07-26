package com.taskManagement.project.controller;

import com.taskManagement.project.config.SecurityUtils;
import com.taskManagement.project.dto.*;
import com.taskManagement.project.model.Tag;
import com.taskManagement.project.model.Task;
import com.taskManagement.project.model.User;
import com.taskManagement.project.service.TaskService;
import com.taskManagement.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<TaskResponseWithStatusDto> createTask(@RequestBody TaskRequestDto dto) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(Task.Priority.valueOf(dto.getPriority()))
                .deadline(dto.getDeadline())
                .build();

        Task created = taskService.createTask(task, user.getId(), dto.getTagNames());
        return ResponseEntity.ok(convertToWithStatusDto(created, user));
    }


//    @GetMapping
//    public ResponseEntity<List<TaskResponseDto>> listTasks() {
//        String email = SecurityUtils.getCurrentUserEmail();
//        User user = userService.findByEmail(email).orElseThrow();
//
//        return ResponseEntity.ok(taskService.getAllTasksById(user.getId())
//                .stream().map(this::convertToDto).collect(Collectors.toList()));
//    }

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> listTasks() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(
                taskService.getAllTasksById(user.getId())
                        .stream()
                        .map(this::convertToDto)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/with-status")
    public ResponseEntity<List<TaskResponseWithStatusDto>> listTasksWithStatus() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(
                taskService.getAllTasksById(user.getId())
                        .stream()
                        .map(task -> convertToWithStatusDto(task, user))
                        .collect(Collectors.toList())
        );
    }



    @GetMapping("/{id}")
    public ResponseEntity<TaskResponseDto> getTask(@PathVariable Long id) {
        Task task = taskService.getTaskById(id).orElseThrow();
        return ResponseEntity.ok(convertToDto(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponseDto> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequestDto dto) {
        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .priority(Task.Priority.valueOf(dto.getPriority()))
                .deadline(dto.getDeadline())
                .build();

        Task updated = taskService.updateTask(id, task, dto.getTagNames());
        return ResponseEntity.ok(convertToDto(updated));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignUsers(@PathVariable Long id, @RequestBody AssignRequestDto dto) {
        taskService.assignUsers(id, dto.getUserIds());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unassign")
    public ResponseEntity<?> unassignUsers(@PathVariable Long id, @RequestBody AssignRequestDto dto) {
        taskService.unassignUsers(id, dto.getUserIds());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateDto dto) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();
        Long userId = user.getId(); //  authenticated user
        taskService.updateTaskStatus(id, userId, dto.getStatusId());
        return ResponseEntity.ok().build();
    }

//    private TaskResponseWithStatusDto convertToWithStatusDto(Task task, User user) {
//        String statusName = task.getTaskAssignments().stream()
//                .filter(mapping -> mapping.getUser().getId().equals(user.getId()))
//                .findFirst()
//                .map(mapping -> mapping.getStatus().getName().name())
//                .orElse(null);
//
//        return TaskResponseWithStatusDto.builder()
//                .id(task.getId())
//                .title(task.getTitle())
//                .description(task.getDescription())
//                .priority(task.getPriority().name())
//                .deadline(task.getDeadline())
//                .createdAt(task.getCreatedAt())
//                .updatedAt(task.getUpdatedAt())
//                .status(statusName)
//
//                // ✅ add tagIds
//                .tagIds(
//                        task.getTags().stream()
//                                .map(Tag::getId)
//                                .collect(Collectors.toSet())
//                )
//
//                // ✅ add assignee emails
//                .assigneeEmails(
//                        task.getTaskAssignments().stream()
//                                .map(mapping -> mapping.getUser().getEmail())
//                                .collect(Collectors.toSet())
//                )
//
//                .build();
//    }
private TaskResponseWithStatusDto convertToWithStatusDto(Task task, User user) {
    String statusName = task.getTaskAssignments().stream()
            .filter(mapping -> mapping.getUser().getId().equals(user.getId()))
            .findFirst()
            .map(mapping -> mapping.getStatus().getName().name())
            .orElse(null);

    return TaskResponseWithStatusDto.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .priority(task.getPriority().name())
            .deadline(task.getDeadline())
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .status(statusName)
            .tagNames(task.getTags().stream()
                    .map(Tag::getName)
                    .collect(Collectors.toSet()))
            .assigneeEmails(task.getTaskAssignments().stream()
                    .map(mapping -> mapping.getUser().getEmail())
                    .collect(Collectors.toSet()))
            .build();
}


    private TaskResponseDto convertToDto(Task task) {
        return TaskResponseDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority().name())
                .deadline(task.getDeadline())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .createdBy(task.getCreatedBy().getEmail())
                .tagNames(task.getTags().stream().map(t -> t.getName()).collect(Collectors.toSet()))
                .assignees(task.getTaskAssignments().stream().map(utm -> utm.getUser().getEmail()).collect(Collectors.toSet()))
                .build();
    }
}
