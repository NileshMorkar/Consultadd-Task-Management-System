package com.taskManagement.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenRequest {
    private String refreshToken;

}