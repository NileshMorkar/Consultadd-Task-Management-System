package com.taskManagement.project.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private String type;
    private boolean readFlag;
    private LocalDateTime createdAt;
    private Long taskId;
}
