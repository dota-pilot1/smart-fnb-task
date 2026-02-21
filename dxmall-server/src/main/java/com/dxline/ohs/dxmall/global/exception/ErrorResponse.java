package com.dxline.ohs.dxmall.global.exception;

public record ErrorResponse(
        int status,
        String message
) {}
