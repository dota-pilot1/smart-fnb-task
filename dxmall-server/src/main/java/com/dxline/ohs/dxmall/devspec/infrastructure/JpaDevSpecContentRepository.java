package com.dxline.ohs.dxmall.devspec.infrastructure;

import com.dxline.ohs.dxmall.devspec.domain.ContentType;
import com.dxline.ohs.dxmall.devspec.domain.DevSpecContent;
import com.dxline.ohs.dxmall.devspec.domain.DevSpecContentRepository;
import com.dxline.ohs.dxmall.devspec.domain.ProjectDevSpec;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaDevSpecContentRepository extends JpaRepository<DevSpecContent, Long>, DevSpecContentRepository {

    @Override
    Optional<DevSpecContent> findByDevSpecAndContentType(ProjectDevSpec devSpec, ContentType contentType);

    @Override
    List<DevSpecContent> findByDevSpec(ProjectDevSpec devSpec);
}
