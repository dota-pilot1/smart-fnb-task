package com.smartfnb.user.presentation;

import com.smartfnb.user.application.AuthService;
import com.smartfnb.user.application.dto.AuthResponse;
import com.smartfnb.user.application.dto.LoginRequest;
import com.smartfnb.user.application.dto.RefreshRequest;
import com.smartfnb.user.application.dto.SignupRequest;
import com.smartfnb.user.domain.Email;
import com.smartfnb.user.domain.User;
import com.smartfnb.user.domain.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    /** 회원가입 */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Access Token 재발급
     * - 프론트에서 Access Token 만료 시(401) 자동 호출
     * - Body: { "refreshToken": "..." }
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    /**
     * 로그아웃
     * - 인증된 유저만 호출 가능 (Authorization: Bearer <accessToken> 헤더 필요)
     * - DB의 refresh token을 삭제해 재발급 불가 상태로 만듦
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(new Email(userDetails.getUsername()))
                .orElseThrow(() -> new IllegalStateException("유저를 찾을 수 없습니다."));
        authService.logout(user.getId());
        return ResponseEntity.noContent().build();
    }
}
