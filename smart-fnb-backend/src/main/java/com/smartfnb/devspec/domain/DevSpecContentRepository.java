package com.smartfnb.devspec.domain;

import java.util.List;
import java.util.Optional;

public interface DevSpecContentRepository {

    DevSpecContent save(DevSpecContent content);

    Optional<DevSpecContent> findByDevSpecAndContentType(ProjectDevSpec devSpec, ContentType contentType);

    List<DevSpecContent> findByDevSpec(ProjectDevSpec devSpec);
}
