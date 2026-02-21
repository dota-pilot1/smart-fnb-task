package com.dxline.ohs.dxmall.devspec.application.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateNameRequest(
        @NotBlank(message = "이름은 필수입니다.")
        String name
) {
}
