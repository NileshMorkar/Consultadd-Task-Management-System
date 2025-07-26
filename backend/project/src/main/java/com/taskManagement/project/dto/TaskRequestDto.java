package com.taskManagement.project.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaskRequestDto {
    private String title;
    private String description;
    private String priority;
    private LocalDateTime deadline;
    private Set<Long> tagIds;
}
