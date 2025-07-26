package com.taskManagement.project.repository;

import com.taskManagement.project.dto.TaskResponseDto;
import com.taskManagement.project.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // Add filtering methods as needed
    List<Task> findAllTasksByCreatedBy_Id(Long createdBy);


}
