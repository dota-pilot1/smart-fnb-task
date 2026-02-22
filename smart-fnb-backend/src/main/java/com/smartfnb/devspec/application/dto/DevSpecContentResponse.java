package com.smartfnb.devspec.application.dto;

import com.smartfnb.devspec.domain.ContentType;
import com.smartfnb.devspec.domain.DevSpecContent;

public record DevSpecContentResponse(
    Long id,
    ContentType contentType,
    String title,
    String content,
    Integer sortOrder
) {
    public static DevSpecContentResponse from(DevSpecContent devSpecContent) {
        return new DevSpecContentResponse(
            devSpecContent.getId(),
            devSpecContent.getContentType(),
            devSpecContent.getTitle(),
            devSpecContent.getContent(),
            devSpecContent.getSortOrder()
        );
    }
}
