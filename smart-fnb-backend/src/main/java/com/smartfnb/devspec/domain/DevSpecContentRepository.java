package com.smartfnb.devspec.domain;

import java.util.List;
import java.util.Optional;

public interface DevSpecContentRepository {
    DevSpecContent save(DevSpecContent content);

    Optional<DevSpecContent> findById(Long id);

    Optional<DevSpecContent> findByDevSpecAndContentType(
        ProjectDevSpec devSpec,
        ContentType contentType
    );

    List<DevSpecContent> findByDevSpec(ProjectDevSpec devSpec);

    List<DevSpecContent> findByDevSpecAndContentTypeOrderBySortOrder(
        ProjectDevSpec devSpec,
        ContentType contentType
    );

    void deleteById(Long id);
}
