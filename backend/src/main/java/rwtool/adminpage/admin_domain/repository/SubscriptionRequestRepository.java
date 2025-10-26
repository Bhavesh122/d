package rwtool.adminpage.admin_domain.repository;

import rwtool.adminpage.admin_domain.model.SubscriptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRequestRepository extends JpaRepository<SubscriptionRequest, String> {
    List<SubscriptionRequest> findByStatus(String status);
    List<SubscriptionRequest> findByUserEmail(String userEmail);
    Optional<SubscriptionRequest> findByUserEmailAndDomainIdAndStatus(String userEmail, String domainId, String status);
    List<SubscriptionRequest> findByUserEmailOrderByRequestedDateDesc(String userEmail);
}
