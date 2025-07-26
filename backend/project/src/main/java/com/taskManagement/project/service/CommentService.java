package com.taskManagement.project.service;

import com.taskManagement.project.model.Comment;
import com.taskManagement.project.model.Task;
import com.taskManagement.project.model.User;
import com.taskManagement.project.repository.CommentRepository;
import com.taskManagement.project.repository.TaskRepository;
import com.taskManagement.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<Comment> getCommentsByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return commentRepository.findByTask(task);
    }

    public Comment addComment(Long taskId, Long userId, String content) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .content(content)
                .task(task)
                .author(user)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
