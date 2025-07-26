package com.taskManagement.project.repository;

import com.taskManagement.project.model.Comment;
import com.taskManagement.project.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTask(Task task);
}
