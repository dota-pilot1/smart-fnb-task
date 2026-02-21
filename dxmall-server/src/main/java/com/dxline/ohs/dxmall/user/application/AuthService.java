package com.dxline.ohs.dxmall.user.application;

import com.dxline.ohs.dxmall.global.security.JwtProvider;
import com.dxline.ohs.dxmall.user.application.dto.AuthResponse;
import com.dxline.ohs.dxmall.user.application.dto.LoginRequest;
import com.dxline.ohs.dxmall.user.application.dto.SignupRequest;
import com.dxline.ohs.dxmall.user.domain.Email;
import com.dxline.ohs.dxmall.user.domain.User;
import com.dxline.ohs.dxmall.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        Email email = new Email(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "이미 사용 중인 이메일입니다: " + request.email()
            );
        }

        User user = User.create(
            request.email(),
            request.password(),
            request.name(),
            passwordEncoder
        );
        userRepository.save(user);

        String token = jwtProvider.generateToken(
            user.getEmail().getValue(),
            user.getRole().name()
        );
        return new AuthResponse(token, user.getName());
    }

    public AuthResponse login(LoginRequest request) {
        Email email = new Email(request.email());

        User user = userRepository
            .findByEmail(email)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "이메일 또는 비밀번호가 올바르지 않습니다."
                )
            );

        if (!user.checkPassword(request.password(), passwordEncoder)) {
            throw new IllegalArgumentException(
                "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        String token = jwtProvider.generateToken(
            user.getEmail().getValue(),
            user.getRole().name()
        );
        return new AuthResponse(token, user.getName());
    }
}
