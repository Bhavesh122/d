package rwtool.adminpage.admin_domain.repository;

import rwtool.adminpage.admin_domain.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DomainRepository extends JpaRepository<Domain, String> {
    Optional<Domain> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
