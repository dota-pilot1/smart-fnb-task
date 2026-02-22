package com.smartfnb.user.application;

import com.smartfnb.global.security.JwtProvider;
import com.smartfnb.user.application.dto.AuthResponse;
import com.smartfnb.user.application.dto.LoginRequest;
import com.smartfnb.user.application.dto.RefreshRequest;
import com.smartfnb.user.application.dto.SignupRequest;
import com.smartfnb.user.domain.Email;
import com.smartfnb.user.domain.RefreshToken;
import com.smartfnb.user.domain.RefreshTokenRepository;
import com.smartfnb.user.domain.User;
import com.smartfnb.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    // ──────────────────────────────────────────────
    // 회원가입
    // ──────────────────────────────────────────────
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        Email email = new Email(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다: " + request.email());
        }

        User user = User.create(request.email(), request.password(), request.name(), passwordEncoder);
        userRepository.save(user);

        return issueTokens(user);
    }

    // ──────────────────────────────────────────────
    // 로그인
    // ──────────────────────────────────────────────
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Email email = new Email(request.email());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!user.checkPassword(request.password(), passwordEncoder)) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return issueTokens(user);
    }

    // ──────────────────────────────────────────────
    // 토큰 재발급 (Access Token 만료 시)
    // ──────────────────────────────────────────────
    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        // 1. DB에서 refresh token 조회
        RefreshToken stored = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다."));

        // 2. 만료 여부 확인
        if (stored.isExpired()) {
            refreshTokenRepository.deleteByUserId(stored.getUserId());
            throw new IllegalArgumentException("리프레시 토큰이 만료되었습니다. 다시 로그인하세요.");
        }

        // 3. JWT 서명 검증
        if (!jwtProvider.isValid(request.refreshToken())) {
            throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 4. 유저 조회
        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> new IllegalStateException("유저를 찾을 수 없습니다."));

        // 5. 새 Access Token + Refresh Token 발급 (Rotate)
        String newAccessToken = jwtProvider.generateToken(
                user.getEmail().getValue(), user.getRole().name());
        String newRefreshToken = jwtProvider.generateRefreshToken(user.getEmail().getValue());

        stored.rotate(newRefreshToken, refreshExpirationMs);

        return new AuthResponse(newAccessToken, newRefreshToken, user.getName());
    }

    // ──────────────────────────────────────────────
    // 로그아웃
    // ──────────────────────────────────────────────
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    // ──────────────────────────────────────────────
    // 내부 공통 로직: Access + Refresh Token 동시 발급
    // ──────────────────────────────────────────────
    private AuthResponse issueTokens(User user) {
        String accessToken = jwtProvider.generateToken(
                user.getEmail().getValue(), user.getRole().name());
        String refreshToken = jwtProvider.generateRefreshToken(user.getEmail().getValue());

        // 기존 refresh token이 있으면 rotate, 없으면 새로 생성
        refreshTokenRepository.findByUserId(user.getId())
                .ifPresentOrElse(
                        existing -> existing.rotate(refreshToken, refreshExpirationMs),
                        () -> refreshTokenRepository.save(
                                RefreshToken.create(user.getId(), refreshToken, refreshExpirationMs)));

        return new AuthResponse(accessToken, refreshToken, user.getName());
    }
}
