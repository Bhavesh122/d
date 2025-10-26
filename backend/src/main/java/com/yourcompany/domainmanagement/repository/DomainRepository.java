package com.yourcompany.domainmanagement.repository;

import com.yourcompany.domainmanagement.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, String> {
    Optional<Domain> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
