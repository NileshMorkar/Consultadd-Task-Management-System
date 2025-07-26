package com.taskManagement.project.repository;

import com.taskManagement.project.model.UserTaskMapping;
import com.taskManagement.project.model.UserTaskMappingId;
import com.taskManagement.project.model.User;
import com.taskManagement.project.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserTaskMappingRepository extends JpaRepository<UserTaskMapping, UserTaskMappingId> {
    List<UserTaskMapping> findByUser(User user);
    List<UserTaskMapping> findByTask(Task task);
    Optional<UserTaskMapping> findByUserAndTask(User user, Task task);
}
