package com.dxline.ohs.dxmall.product.infrastructure;

import com.dxline.ohs.dxmall.product.domain.Product;
import com.dxline.ohs.dxmall.product.domain.ProductRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaProductRepository extends JpaRepository<Product, Long>, ProductRepository {
}
