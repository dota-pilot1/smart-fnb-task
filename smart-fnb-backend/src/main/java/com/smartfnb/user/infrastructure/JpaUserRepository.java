package com.smartfnb.user.infrastructure;

import com.smartfnb.user.domain.Email;
import com.smartfnb.user.domain.User;
import com.smartfnb.user.domain.UserRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Long>, UserRepository {

    @Override
    Optional<User> findByEmail(Email email);

    @Override
    boolean existsByEmail(Email email);
}
