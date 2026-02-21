package com.smartfnb.devspec.domain;

import java.util.List;
import java.util.Optional;

public interface DevSpecRepository {

    ProjectDevSpec save(ProjectDevSpec devSpec);

    Optional<ProjectDevSpec> findById(Long id);

    List<ProjectDevSpec> findByParentIsNull();

    void deleteById(Long id);
}
