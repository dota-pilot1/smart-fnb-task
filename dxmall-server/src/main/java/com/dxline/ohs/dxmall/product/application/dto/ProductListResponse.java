package com.dxline.ohs.dxmall.product.application.dto;

import java.util.List;

public record ProductListResponse(
        List<ProductResponse> products
) {}
