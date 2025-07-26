package com.taskManagement.project.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TagDto {
    private Long id;
    private String name;
}
