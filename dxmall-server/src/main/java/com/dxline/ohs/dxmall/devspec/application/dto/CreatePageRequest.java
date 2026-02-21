package com.dxline.ohs.dxmall.devspec.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record CreatePageRequest(
        @NotBlank(message = "페이지명은 필수입니다.")
        @Schema(example = "상품 목록 페이지")
        String name
) {
}
