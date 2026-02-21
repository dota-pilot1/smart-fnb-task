package com.smartfnb.product.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateProductRequest(
        @NotBlank(message = "상품명은 필수입니다.")
        @Schema(example = "클래식 티셔츠")
        String name,

        @Schema(example = "편안한 면 소재의 클래식 티셔츠입니다.")
        String description,

        @NotNull(message = "가격은 필수입니다.")
        @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
        @Schema(example = "29000")
        Integer price,

        @NotNull(message = "재고 수량은 필수입니다.")
        @Min(value = 0, message = "재고는 0개 이상이어야 합니다.")
        @Schema(example = "100")
        Integer stockQuantity,

        @Schema(example = "https://example.com/image.jpg")
        String imageUrl
) {}
