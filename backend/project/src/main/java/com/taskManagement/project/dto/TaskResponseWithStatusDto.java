package com.taskManagement.project.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class TaskResponseWithStatusDto {
    private Long id;
    private String title;
    private String description;
    private String priority;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Set<String> tagNames; // ✅ changed from tagIds to tagNames
    private Set<String> assigneeEmails;
    private String status; // ✅ specific to the current user
}
