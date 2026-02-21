package com.smartfnb.user.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @Schema(example = "terecal@daum.net")
    String email,

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Schema(example = "terecal")
    String password
) {}
