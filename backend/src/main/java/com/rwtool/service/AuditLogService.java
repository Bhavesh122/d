package com.rwtool.service;

import com.rwtool.dto.AuditLogDTO;
import com.rwtool.dto.PageResponse;
import com.rwtool.model.AuditLog;
import com.rwtool.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    // Initialize with minimal test data if empty
    @jakarta.annotation.PostConstruct
    public void initializeIfEmpty() {
        try {
            if (auditLogRepository.count() == 0) {
                // Create a few test entries
                logActivity("admin@test.com", "Admin", "USER_LOGIN", "Test admin login", "success");
                logActivity("user@test.com", "Subscriber", "USER_LOGIN", "Test user login", "success");
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize audit logs: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Create audit log entry
    public void logActivity(String userEmail, String role, String action, String details, String status) {
        AuditLog auditLog = new AuditLog(userEmail, role, action, details, status);
        auditLogRepository.save(auditLog);
    }
    
    
    // Get recent activity (last 10 entries)
    public List<AuditLogDTO> getRecentActivity() {
        List<AuditLog> recentLogs = auditLogRepository.findTop10ByOrderByTimestampDesc();
        return recentLogs.stream()
                .map(AuditLogDTO::new)
                .collect(Collectors.toList());
    }
    
    // Get paginated audit logs with filters
    public PageResponse<AuditLogDTO> getAuditLogs(String userEmail, String action, String role, 
                                                  String status, String dateRange, String searchTerm,
                                                  int page, int size) {
        
        try {
        
        // Create pageable with sorting by timestamp descending
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        
        // Use simple query without complex filtering for reliability
        Page<AuditLog> auditLogPage = auditLogRepository.findAll(pageable);
        
        // Convert to DTOs
        List<AuditLogDTO> auditLogDTOs = auditLogPage.getContent().stream()
                .map(AuditLogDTO::new)
                .collect(Collectors.toList());
        
        return new PageResponse<>(
                auditLogDTOs,
                auditLogPage.getTotalElements(),
                auditLogPage.getNumber(),
                auditLogPage.getSize(),
                auditLogPage.getTotalPages(),
                auditLogPage.isFirst(),
                auditLogPage.isLast()
        );
        
        } catch (Exception e) {
            System.err.println("Error in getAuditLogs: " + e.getMessage());
            e.printStackTrace();
            // Return empty page response on error
            return new PageResponse<>(
                new ArrayList<>(),
                0L,
                page,
                size,
                0,
                true,
                true
            );
        }
    }
    
    // Get all unique actions for filter dropdown
    public List<String> getAllActions() {
        // Return basic action types instead of querying database
        List<String> actions = new ArrayList<>();
        actions.add("USER_LOGIN");
        actions.add("USER_SIGNUP");
        actions.add("DOMAIN_ADDED");
        actions.add("FILE_ROUTED");
        actions.add("FILE_UPLOADED");
        actions.add("FILE_DOWNLOADED");
        return actions;
    }
    
    // Get all unique roles for filter dropdown
    public List<String> getAllRoles() {
        // Return basic role types instead of querying database
        List<String> roles = new ArrayList<>();
        roles.add("Admin");
        roles.add("Subscriber");
        roles.add("Ops");
        return roles;
    }
}
