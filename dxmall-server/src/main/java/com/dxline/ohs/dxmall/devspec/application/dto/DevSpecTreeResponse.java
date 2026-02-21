package com.dxline.ohs.dxmall.devspec.application.dto;

import com.dxline.ohs.dxmall.devspec.domain.ProjectDevSpec;
import com.dxline.ohs.dxmall.devspec.domain.SpecStatus;
import com.dxline.ohs.dxmall.devspec.domain.SpecType;

import java.util.List;

public record DevSpecTreeResponse(
        Long id,
        String name,
        SpecType type,
        SpecStatus status,
        int sortOrder,
        int depth,
        List<DevSpecTreeResponse> children
) {
    public static DevSpecTreeResponse from(ProjectDevSpec spec) {
        return new DevSpecTreeResponse(
                spec.getId(),
                spec.getName(),
                spec.getType(),
                spec.getStatus(),
                spec.getSortOrder(),
                spec.getDepth(),
                spec.getChildren().stream()
                        .map(DevSpecTreeResponse::from)
                        .toList()
        );
    }
}
