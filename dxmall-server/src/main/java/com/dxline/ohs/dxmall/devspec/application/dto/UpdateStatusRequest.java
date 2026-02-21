package com.dxline.ohs.dxmall.devspec.application.dto;

import com.dxline.ohs.dxmall.devspec.domain.SpecStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull(message = "상태는 필수입니다.")
        SpecStatus status
) {
}
