package com.smartfnb.devspec.application.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateFigmaLinkRequest(
        @NotBlank(message = "제목은 필수입니다.")
        String title,
        String description,
        @NotBlank(message = "URL은 필수입니다.")
        String url
) {
}
