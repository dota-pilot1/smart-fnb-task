package com.smartfnb.user.domain;

import java.util.Optional;

public interface UserRepository {

    User save(User user);

    Optional<User> findByEmail(Email email);

    Optional<User> findById(Long id);

    boolean existsByEmail(Email email);
}
