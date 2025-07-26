package com.taskManagement.project.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CommentRequestDto {
    private String content;
}
