package com.dxline.ohs.dxmall.user.infrastructure;

import com.dxline.ohs.dxmall.user.domain.Email;
import com.dxline.ohs.dxmall.user.domain.User;
import com.dxline.ohs.dxmall.user.domain.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Long>, UserRepository {

    @Override
    Optional<User> findByEmail(Email email);

    @Override
    boolean existsByEmail(Email email);
}
