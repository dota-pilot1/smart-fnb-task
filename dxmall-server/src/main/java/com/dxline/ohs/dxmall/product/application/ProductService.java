package com.dxline.ohs.dxmall.product.application;

import com.dxline.ohs.dxmall.product.application.dto.CreateProductRequest;
import com.dxline.ohs.dxmall.product.application.dto.ProductListResponse;
import com.dxline.ohs.dxmall.product.application.dto.ProductResponse;
import com.dxline.ohs.dxmall.product.domain.Product;
import com.dxline.ohs.dxmall.product.domain.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse create(CreateProductRequest request) {
        Product product = Product.create(
                request.name(),
                request.description(),
                request.price(),
                request.stockQuantity(),
                request.imageUrl()
        );
        productRepository.save(product);
        return ProductResponse.from(product);
    }

    public ProductListResponse findAll() {
        List<ProductResponse> products = productRepository.findAll().stream()
                .map(ProductResponse::from)
                .toList();
        return new ProductListResponse(products);
    }

    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + id));
        return ProductResponse.from(product);
    }
}
