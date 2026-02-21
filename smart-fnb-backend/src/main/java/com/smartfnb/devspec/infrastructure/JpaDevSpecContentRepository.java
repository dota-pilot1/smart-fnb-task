package com.smartfnb.devspec.infrastructure;

import com.smartfnb.devspec.domain.ContentType;
import com.smartfnb.devspec.domain.DevSpecContent;
import com.smartfnb.devspec.domain.DevSpecContentRepository;
import com.smartfnb.devspec.domain.ProjectDevSpec;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaDevSpecContentRepository extends JpaRepository<DevSpecContent, Long>, DevSpecContentRepository {

    @Override
    Optional<DevSpecContent> findByDevSpecAndContentType(ProjectDevSpec devSpec, ContentType contentType);

    @Override
    List<DevSpecContent> findByDevSpec(ProjectDevSpec devSpec);
}
