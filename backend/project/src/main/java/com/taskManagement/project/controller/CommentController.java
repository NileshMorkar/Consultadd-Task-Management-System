package com.taskManagement.project.controller;

import com.taskManagement.project.config.SecurityUtils;
import com.taskManagement.project.dto.CommentRequestDto;
import com.taskManagement.project.dto.CommentResponseDto;
import com.taskManagement.project.model.Comment;
import com.taskManagement.project.model.User;
import com.taskManagement.project.service.CommentService;
import com.taskManagement.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks/{taskId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long taskId) {
        List<Comment> comments = commentService.getCommentsByTaskId(taskId);
        return ResponseEntity.ok(comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<CommentResponseDto> addComment(
            @PathVariable Long taskId,
            @RequestBody CommentRequestDto dto) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();

        Long userId = user.getId(); //  authenticated user
        Comment comment = commentService.addComment(taskId, userId, dto.getContent());
        return ResponseEntity.ok(toDto(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    private CommentResponseDto toDto(Comment comment) {
        return CommentResponseDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(comment.getAuthor().getEmail())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
