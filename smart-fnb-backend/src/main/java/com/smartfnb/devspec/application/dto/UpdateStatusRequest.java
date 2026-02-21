package com.smartfnb.devspec.application.dto;

import com.smartfnb.devspec.domain.SpecStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull(message = "상태는 필수입니다.")
        SpecStatus status
) {
}
