package com.taskManagement.project.model;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserTaskMappingId implements Serializable {
    private Long user;
    private Long task;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserTaskMappingId)) return false;
        UserTaskMappingId that = (UserTaskMappingId) o;
        return Objects.equals(user, that.user) && Objects.equals(task, that.task);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, task);
    }
}
