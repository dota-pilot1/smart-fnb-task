package com.smartfnb.devspec.infrastructure;

import com.smartfnb.devspec.domain.FigmaLink;
import com.smartfnb.devspec.domain.FigmaLinkRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaFigmaLinkRepository extends JpaRepository<FigmaLink, Long>, FigmaLinkRepository {
}
