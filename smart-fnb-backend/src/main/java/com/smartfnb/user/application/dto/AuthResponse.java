package com.smartfnb.user.application.dto;

public record AuthResponse(String accessToken, String refreshToken, String name) {
}
