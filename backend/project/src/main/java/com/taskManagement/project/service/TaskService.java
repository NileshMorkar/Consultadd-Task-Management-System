package com.taskManagement.project.service;

import com.taskManagement.project.model.*;
import com.taskManagement.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final StatusRepository statusRepository;
    private final UserTaskMappingRepository userTaskMappingRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task, Long creatorId, Set<Long> tagIds) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
        task.setTags(tags);
        task.setCreatedBy(creator);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, Task updatedData, Set<Long> tagIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(updatedData.getTitle());
        task.setDescription(updatedData.getDescription());
        task.setPriority(updatedData.getPriority());
        task.setDeadline(updatedData.getDeadline());
        task.setUpdatedAt(LocalDateTime.now());

        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
        task.setTags(tags);

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public void assignUsers(Long taskId, Set<Long> userIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Status defaultStatus = statusRepository.findByName(Status.StatusName.TODO)
                .orElseThrow(() -> new RuntimeException("Default status not found"));

        for (Long userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            UserTaskMapping mapping = new UserTaskMapping(user, task, defaultStatus, LocalDateTime.now());
            userTaskMappingRepository.save(mapping);
        }
    }

    public void unassignUsers(Long taskId, Set<Long> userIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        for (Long userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            userTaskMappingRepository.findByUserAndTask(user, task)
                    .ifPresent(userTaskMappingRepository::delete);
        }
    }

    public void updateTaskStatus(Long taskId, Long userId, Integer statusId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Status not found"));

        UserTaskMapping mapping = userTaskMappingRepository.findByUserAndTask(user, task)
                .orElseThrow(() -> new RuntimeException("Task not assigned to user"));

        mapping.setStatus(status);
        userTaskMappingRepository.save(mapping);
    }

    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }
}
