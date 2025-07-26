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
    private final NotificationService notificationService;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getAllTasksById(Long id){
        return taskRepository.findAllTasksByCreatedBy_Id(id);
    }

//    public Task createTask(Task task, Long creatorId, Set<Long> tagIds) {
//        User creator = userRepository.findById(creatorId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
//
//
//        task.setTags(tags);
//        task.setCreatedBy(creator);
//        task.setCreatedAt(LocalDateTime.now());
//        task.setUpdatedAt(LocalDateTime.now());
//
//        return taskRepository.save(task);
//    }

//    public Task createTask(Task task, Long creatorId, Set<Long> tagIds) {
//        User creator = userRepository.findById(creatorId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
//        Status defaultStatus = statusRepository.findByName(Status.StatusName.TODO)
//                .orElseThrow(() -> new RuntimeException("Default status not found"));
//
//        task.setTags(tags);
//        task.setCreatedBy(creator);
//        task.setCreatedAt(LocalDateTime.now());
//        task.setUpdatedAt(LocalDateTime.now());
//
//        // 💾 Save the task first to generate ID
//        Task savedTask = taskRepository.save(task);
//
//        // 👥 Create user-task mapping after task is saved
//        UserTaskMapping mapping = UserTaskMapping.builder()
//                .task(savedTask)
//                .user(creator)
//                .status(defaultStatus)
//                .assignedAt(LocalDateTime.now())
//                .build();
//
//        userTaskMappingRepository.save(mapping);
//
//        return savedTask;
//    }
public Task createTask(Task task, Long creatorId, Set<String> tagNames) {
    User creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Convert tag names to Tag entities
    Set<Tag> tags = tagNames.stream()
            .map(name -> tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()))
            ).collect(Collectors.toSet());

    task.setTags(tags);
    task.setCreatedBy(creator);
    task.setCreatedAt(LocalDateTime.now());
    task.setUpdatedAt(LocalDateTime.now());

    Task savedTask = taskRepository.save(task);

    // Assign the creator as the initial user-task mapping
    Status todoStatus = statusRepository.findByName(Status.StatusName.TODO)
            .orElseThrow(() -> new RuntimeException("Status TODO not found"));

    UserTaskMapping mapping = UserTaskMapping.builder()
            .task(savedTask)
            .user(creator)
            .status(todoStatus)
            .build();

    userTaskMappingRepository.save(mapping);
    savedTask.setTaskAssignments(Set.of(mapping));

    return savedTask;
}


//    public Task updateTask(Long taskId, Task updatedData, Set<Long> tagIds) {
//        Task task = taskRepository.findById(taskId)
//                .orElseThrow(() -> new RuntimeException("Task not found"));
//
//        task.setTitle(updatedData.getTitle());
//        task.setDescription(updatedData.getDescription());
//        task.setPriority(updatedData.getPriority());
//        task.setDeadline(updatedData.getDeadline());
//        task.setUpdatedAt(LocalDateTime.now());
//
//        Set<Tag> tags = new HashSet<>(tagRepository.findAllById(tagIds));
//        task.setTags(tags);
//
//        return taskRepository.save(task);
//    }
public Task updateTask(Long taskId, Task updatedTaskData, Set<String> tagNames) {
    Task existingTask = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));

    existingTask.setTitle(updatedTaskData.getTitle());
    existingTask.setDescription(updatedTaskData.getDescription());
    existingTask.setPriority(updatedTaskData.getPriority());
    existingTask.setDeadline(updatedTaskData.getDeadline());
    existingTask.setUpdatedAt(LocalDateTime.now());

    Set<Tag> tags = tagNames.stream()
            .map(name -> tagRepository.findByName(name)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()))
            ).collect(Collectors.toSet());

    existingTask.setTags(tags);

    return taskRepository.save(existingTask);
}

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public void assignUsers(Long taskId, Set<Long> userIds) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Status defaultStatus = statusRepository.findByName(Status.StatusName.TODO)
                .orElseThrow(() -> new RuntimeException("Default status not found"));

        Set<User> assignees = userTaskMappingRepository.findByTask(task)
                .stream().map(UserTaskMapping::getUser).collect(Collectors.toSet());

        assignees.remove(task.getCreatedBy()); // Don't notify self

        notificationService.notifyUsers(assignees, task, "New task assigned: " + task.getTitle());


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

        Set<User> assignees = userTaskMappingRepository.findByTask(task)
                .stream().map(UserTaskMapping::getUser).collect(Collectors.toSet());

        assignees.remove(task.getCreatedBy()); // Don't notify self

        notificationService.notifyUsers(assignees, task, " Task unassigned: " + task.getTitle());


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
