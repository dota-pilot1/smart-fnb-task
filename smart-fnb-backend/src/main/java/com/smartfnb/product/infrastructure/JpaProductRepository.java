package com.smartfnb.product.infrastructure;

import com.smartfnb.product.domain.Product;
import com.smartfnb.product.domain.ProductRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaProductRepository extends JpaRepository<Product, Long>, ProductRepository {
}
