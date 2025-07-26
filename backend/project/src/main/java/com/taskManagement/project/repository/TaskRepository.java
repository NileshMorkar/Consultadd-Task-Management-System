package com.taskManagement.project.repository;

import com.taskManagement.project.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Add filtering methods as needed
}
