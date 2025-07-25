package com.taskManagement.project.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Primary;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "application_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "full_name",
            nullable = false
    )
    private String fullName;

    @Column(
            nullable = false,
            unique = true
    )
    private String username;

    @Column(nullable = false)
    private String password;

    public User(String fullName, String username, String password) {
        this.fullName = fullName;
        this.username = username;
        this.password = password;

    }
}