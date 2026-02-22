package com.smartfnb.organization.application.dto;

import com.smartfnb.organization.domain.Organization;
import java.util.List;

public record OrganizationTreeResponse(
    Long id,
    String name,
    int sortOrder,
    int depth,
    List<OrganizationTreeResponse> children,
    List<MemberResponse> members
) {
    public static OrganizationTreeResponse from(Organization org) {
        return new OrganizationTreeResponse(
            org.getId(),
            org.getName(),
            org.getSortOrder(),
            org.getDepth(),
            org.getChildren().stream()
                .map(OrganizationTreeResponse::from)
                .toList(),
            org.getMembers().stream()
                .map(MemberResponse::from)
                .toList()
        );
    }
}
