package com.smartfnb.user.domain;

import com.smartfnb.organization.domain.Organization;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    User save(User user);

    Optional<User> findByEmail(Email email);

    Optional<User> findById(Long id);

    boolean existsByEmail(Email email);

    List<User> findByOrganization(Organization organization);

    List<User> findByOrganizationIsNull();

    List<User> findAll();
}
