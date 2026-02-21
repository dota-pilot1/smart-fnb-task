package com.dxline.ohs.dxmall.devspec.application.dto;

import com.dxline.ohs.dxmall.devspec.domain.ContentType;
import com.dxline.ohs.dxmall.devspec.domain.DevSpecContent;

public record DevSpecContentResponse(
        Long id,
        ContentType contentType,
        String content
) {
    public static DevSpecContentResponse from(DevSpecContent devSpecContent) {
        return new DevSpecContentResponse(
                devSpecContent.getId(),
                devSpecContent.getContentType(),
                devSpecContent.getContent()
        );
    }
}
