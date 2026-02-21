package com.dxline.ohs.dxmall.devspec.infrastructure;

import com.dxline.ohs.dxmall.devspec.domain.DevSpecRepository;
import com.dxline.ohs.dxmall.devspec.domain.ProjectDevSpec;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaDevSpecRepository extends JpaRepository<ProjectDevSpec, Long>, DevSpecRepository {
}
