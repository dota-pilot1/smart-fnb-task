package com.smartfnb.organization.domain;

import java.util.List;
import java.util.Optional;

public interface OrganizationRepository {

    Organization save(Organization organization);

    Optional<Organization> findById(Long id);

    List<Organization> findByParentIsNull();

    void deleteById(Long id);
}
