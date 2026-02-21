package com.smartfnb.devspec.infrastructure;

import com.smartfnb.devspec.domain.DevSpecRepository;
import com.smartfnb.devspec.domain.ProjectDevSpec;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaDevSpecRepository extends JpaRepository<ProjectDevSpec, Long>, DevSpecRepository {
}
