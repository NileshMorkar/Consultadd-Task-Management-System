package com.taskManagement.project.controller;

import com.taskManagement.project.config.SecurityUtils;
import com.taskManagement.project.dto.UserResponseDto;
import com.taskManagement.project.dto.UserUpdateDto;
import com.taskManagement.project.model.User;
import com.taskManagement.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<User> allUsers = userService.findAll();
        List<UserResponseDto> response = allUsers.stream()
                .map(user -> UserResponseDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();

        return ResponseEntity.ok(UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateProfile(@RequestBody UserUpdateDto dto) {
        String email = SecurityUtils.getCurrentUserEmail();
        User user = userService.findByEmail(email).orElseThrow();
        Long userId = user.getId(); //  authenticated user
        User updated = userService.updateProfile(userId, user.getEmail(), dto.getFullName());
        return ResponseEntity.ok(UserResponseDto.builder()
                .id(updated.getId())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .build());
    }
}
