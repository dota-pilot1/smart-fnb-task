package com.smartfnb.user.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 어느 유저의 리프레시 토큰인지 (1:1 관계) */
    @Column(nullable = false, unique = true)
    private Long userId;

    /** 실제 JWT refresh token 문자열 */
    @Column(nullable = false, length = 512)
    private String token;

    /** 만료 시각 */
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    private RefreshToken(Long userId, String token, LocalDateTime expiresAt) {
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    public static RefreshToken create(Long userId, String token, long refreshExpirationMs) {
        LocalDateTime expiresAt = LocalDateTime.now()
                .plusSeconds(refreshExpirationMs / 1000);
        return new RefreshToken(userId, token, expiresAt);
    }

    /** 토큰 rotate: 새 토큰 문자열과 만료시간으로 교체 */
    public void rotate(String newToken, long refreshExpirationMs) {
        this.token = newToken;
        this.expiresAt = LocalDateTime.now()
                .plusSeconds(refreshExpirationMs / 1000);
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }
}
