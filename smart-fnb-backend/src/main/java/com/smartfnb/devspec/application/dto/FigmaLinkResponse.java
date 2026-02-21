package com.smartfnb.devspec.application.dto;

import com.smartfnb.devspec.domain.FigmaLink;

import java.time.LocalDateTime;

public record FigmaLinkResponse(
        Long id,
        String title,
        String description,
        String url,
        LocalDateTime createdAt
) {
    public static FigmaLinkResponse from(FigmaLink link) {
        return new FigmaLinkResponse(
                link.getId(),
                link.getTitle(),
                link.getDescription(),
                link.getUrl(),
                link.getCreatedAt()
        );
    }
}
