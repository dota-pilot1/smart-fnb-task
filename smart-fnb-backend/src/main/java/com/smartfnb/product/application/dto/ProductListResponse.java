package com.smartfnb.product.application.dto;

import java.util.List;

public record ProductListResponse(
        List<ProductResponse> products
) {}
