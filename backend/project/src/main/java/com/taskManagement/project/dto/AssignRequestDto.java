package com.taskManagement.project.dto;

import lombok.*;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AssignRequestDto {
    private Set<Long> userIds;
}
