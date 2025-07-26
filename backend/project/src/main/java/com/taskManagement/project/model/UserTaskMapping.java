package com.taskManagement.project.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_task_mappings")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@IdClass(UserTaskMappingId.class)
public class UserTaskMapping {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private Status status;

    @CreationTimestamp
    private LocalDateTime assignedAt;
}
