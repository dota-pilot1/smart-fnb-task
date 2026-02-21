package com.dxline.ohs.dxmall.devspec.application.dto;

import com.dxline.ohs.dxmall.devspec.domain.ProjectDevSpec;
import com.dxline.ohs.dxmall.devspec.domain.SpecStatus;
import com.dxline.ohs.dxmall.devspec.domain.SpecType;

import java.time.LocalDateTime;
import java.util.List;

public record DevSpecDetailResponse(
        Long id,
        String name,
        SpecType type,
        SpecStatus status,
        int sortOrder,
        int depth,
        Long parentId,
        String parentName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<DevSpecContentResponse> contents
) {
    public static DevSpecDetailResponse from(ProjectDevSpec spec, List<DevSpecContentResponse> contents) {
        return new DevSpecDetailResponse(
                spec.getId(),
                spec.getName(),
                spec.getType(),
                spec.getStatus(),
                spec.getSortOrder(),
                spec.getDepth(),
                spec.getParent() != null ? spec.getParent().getId() : null,
                spec.getParent() != null ? spec.getParent().getName() : null,
                spec.getCreatedAt(),
                spec.getUpdatedAt(),
                contents
        );
    }
}
