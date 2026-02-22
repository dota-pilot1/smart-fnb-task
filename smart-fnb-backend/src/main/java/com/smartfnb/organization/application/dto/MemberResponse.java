package com.smartfnb.organization.application.dto;

import com.smartfnb.user.domain.Role;
import com.smartfnb.user.domain.User;

public record MemberResponse(
    Long id,
    String name,
    String email,
    Role role
) {
    public static MemberResponse from(User user) {
        return new MemberResponse(
            user.getId(),
            user.getName(),
            user.getEmail().getValue(),
            user.getRole()
        );
    }
}
