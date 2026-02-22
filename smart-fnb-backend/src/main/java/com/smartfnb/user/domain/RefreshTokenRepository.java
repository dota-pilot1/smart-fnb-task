package com.smartfnb.user.domain;

import java.util.Optional;

public interface RefreshTokenRepository {

    /** JPA save()와 시그니처 호환을 위해 반환타입을 RefreshToken으로 통일 */
    RefreshToken save(RefreshToken refreshToken);

    /** token 문자열로 조회 (refresh 요청 시 사용) */
    Optional<RefreshToken> findByToken(String token);

    /** userId로 조회 (로그인 시 기존 토큰 rotate) */
    Optional<RefreshToken> findByUserId(Long userId);

    /** 로그아웃 시 삭제 */
    void deleteByUserId(Long userId);
}
