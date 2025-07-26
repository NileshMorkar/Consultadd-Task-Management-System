package com.taskManagement.project.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserResponseDto {
    private Long id;
    private String email;
    private String fullName;
}
