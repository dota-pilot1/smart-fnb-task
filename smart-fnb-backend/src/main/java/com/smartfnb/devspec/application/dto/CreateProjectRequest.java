package com.smartfnb.devspec.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CreateProjectRequest(
    @NotBlank(message = "프로젝트명은 필수입니다.")
    @Schema(example = "Smart F&B 프로젝트")
    String name
) {}
