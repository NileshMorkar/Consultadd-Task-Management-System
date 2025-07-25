package com.taskManagement.project.controller;

import com.taskManagement.project.dto.RegisterRequest;
import com.taskManagement.project.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class testController {

    @GetMapping("")
    public ResponseEntity<?> registerUser() {
        // Save the new user to the database and return success response.

        return ResponseEntity.ok("Test Successful");
    }
}