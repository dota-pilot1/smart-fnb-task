package com.smartfnb.devspec.domain;

import java.util.List;
import java.util.Optional;

public interface FigmaLinkRepository {

    FigmaLink save(FigmaLink figmaLink);

    List<FigmaLink> findByDevSpec(ProjectDevSpec devSpec);

    Optional<FigmaLink> findById(Long id);

    void deleteById(Long id);
}
