package com.smartfnb.user.infrastructure;

import com.smartfnb.user.domain.RefreshToken;
import com.smartfnb.user.domain.RefreshTokenRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JpaRefreshTokenRepository
        extends JpaRepository<RefreshToken, Long>, RefreshTokenRepository {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
