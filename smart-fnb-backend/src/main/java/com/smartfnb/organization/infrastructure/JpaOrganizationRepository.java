package com.smartfnb.organization.infrastructure;

import com.smartfnb.organization.domain.Organization;
import com.smartfnb.organization.domain.OrganizationRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaOrganizationRepository
    extends JpaRepository<Organization, Long>, OrganizationRepository {
}
