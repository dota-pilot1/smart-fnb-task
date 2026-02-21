package com.smartfnb.global.exception;

public record ErrorResponse(
        int status,
        String message
) {}
