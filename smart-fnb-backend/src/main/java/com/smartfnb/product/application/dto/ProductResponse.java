package com.smartfnb.product.application.dto;

import com.smartfnb.product.domain.Product;

public record ProductResponse(
        Long id,
        String name,
        String description,
        int price,
        int stockQuantity,
        String imageUrl
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice().getValue(),
                product.getStockQuantity(),
                product.getImageUrl()
        );
    }
}
