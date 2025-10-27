package com.rwtool.service;

import com.rwtool.dto.ApprovalDecisionDTO;
import com.rwtool.dto.SubscriptionRequestDTO;
import com.rwtool.model.SubscriptionRequest;
import com.rwtool.repository.SubscriptionRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubscriptionRequestService {

    @Autowired
    private SubscriptionRequestRepository subscriptionRequestRepository;

    public List<SubscriptionRequest> getAllRequests() {
        return subscriptionRequestRepository.findAll();
    }

    public List<SubscriptionRequest> getPendingRequests() {
        return subscriptionRequestRepository.findByStatus("PENDING");
    }

    public List<SubscriptionRequest> getRequestsByUser(String userEmail) {
        return subscriptionRequestRepository.findByUserEmailOrderByRequestedDateDesc(userEmail);
    }

    public SubscriptionRequest getRequestById(String id) {
        return subscriptionRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subscription request not found with id: " + id));
    }

    @Transactional
    public SubscriptionRequest createRequest(SubscriptionRequestDTO requestDTO) {
        // Check if user already has a pending request for this domain
        Optional<SubscriptionRequest> existingRequest = subscriptionRequestRepository
                .findByUserEmailAndDomainIdAndStatus(
                        requestDTO.getUserEmail(), 
                        requestDTO.getDomainId(), 
                        "PENDING"
                );
        
        if (existingRequest.isPresent()) {
            throw new RuntimeException("You already have a pending request for this domain");
        }

        // Check if user already has approved access
        Optional<SubscriptionRequest> approvedRequest = subscriptionRequestRepository
                .findByUserEmailAndDomainIdAndStatus(
                        requestDTO.getUserEmail(), 
                        requestDTO.getDomainId(), 
                        "APPROVED"
                );
        
        if (approvedRequest.isPresent()) {
            throw new RuntimeException("You already have approved access to this domain");
        }

        SubscriptionRequest request = new SubscriptionRequest();
        request.setId(UUID.randomUUID().toString());
        request.setDomainId(requestDTO.getDomainId());
        request.setDomainName(requestDTO.getDomainName());
        request.setRequestReason(requestDTO.getRequestReason());
        request.setUserName(requestDTO.getUserName());
        request.setUserEmail(requestDTO.getUserEmail());
        request.setUserDepartment(requestDTO.getUserDepartment());
        request.setUserRole(requestDTO.getUserRole());
        request.setStatus("PENDING");
        request.setRequestedDate(LocalDateTime.now());

        return subscriptionRequestRepository.save(request);
    }

    @Transactional
    public SubscriptionRequest approveRequest(String requestId) {
        SubscriptionRequest request = getRequestById(requestId);
        
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be approved");
        }

        request.setStatus("APPROVED");
        request.setReviewedDate(LocalDateTime.now());
        request.setRejectionReason(null);

        return subscriptionRequestRepository.save(request);
    }

    @Transactional
    public SubscriptionRequest rejectRequest(String requestId, String rejectionReason) {
        SubscriptionRequest request = getRequestById(requestId);
        
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be rejected");
        }

        request.setStatus("REJECTED");
        request.setReviewedDate(LocalDateTime.now());
        request.setRejectionReason(rejectionReason);

        return subscriptionRequestRepository.save(request);
    }

    @Transactional
    public SubscriptionRequest processRequest(String requestId, ApprovalDecisionDTO decision) {
        if ("APPROVE".equalsIgnoreCase(decision.getAction())) {
            return approveRequest(requestId);
        } else if ("REJECT".equalsIgnoreCase(decision.getAction())) {
            String reason = decision.getRejectionReason();
            if (reason == null || reason.trim().isEmpty()) {
                reason = "Request rejected by admin";
            }
            return rejectRequest(requestId, reason);
        } else {
            throw new RuntimeException("Invalid action. Must be APPROVE or REJECT");
        }
    }

    @Transactional
    public void cancelRequest(String requestId, String userEmail) {
        SubscriptionRequest request = getRequestById(requestId);
        
        if (!request.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("You can only cancel your own requests");
        }
        
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be cancelled");
        }

        subscriptionRequestRepository.delete(request);
    }
}
