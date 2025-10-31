package com.rwtool.controller;

import com.rwtool.dto.AuditLogDTO;
import com.rwtool.dto.PageResponse;
import com.rwtool.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AuditLogController {
    
    @Autowired
    private AuditLogService auditLogService;
    
    // Get recent activity (last 10 entries)
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLogDTO>> getRecentActivity() {
        try {
            List<AuditLogDTO> recentActivity = auditLogService.getRecentActivity();
            return ResponseEntity.ok(recentActivity);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get paginated audit logs with filters
    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<AuditLogDTO>> getAuditLogs(
            @RequestParam(required = false) String userEmail,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "7days") String dateRange,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            PageResponse<AuditLogDTO> auditLogs = auditLogService.getAuditLogs(
                    userEmail, action, role, status, dateRange, searchTerm, page, size);
            return ResponseEntity.ok(auditLogs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get all unique actions for filter dropdown
    @GetMapping("/actions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getAllActions() {
        try {
            List<String> actions = auditLogService.getAllActions();
            return ResponseEntity.ok(actions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Get all unique roles for filter dropdown
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getAllRoles() {
        try {
            List<String> roles = auditLogService.getAllRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Manual log entry (for testing or manual entries)
    @PostMapping("/log")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createAuditLog(
            @RequestParam String userEmail,
            @RequestParam String role,
            @RequestParam String action,
            @RequestParam String details,
            @RequestParam String status) {
        
        try {
            auditLogService.logActivity(userEmail, role, action, details, status);
            return ResponseEntity.ok("Audit log created successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create audit log");
        }
    }
    
    // Test endpoint to create sample audit logs (for testing only)
    @PostMapping("/test-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createTestData() {
        try {
            // Create some test audit logs
            auditLogService.logActivity("admin@rwtool.com", "Admin", "USER_LOGIN", "Admin logged in successfully", "success");
            auditLogService.logActivity("user@rwtool.com", "Subscriber", "USER_LOGIN", "User logged in successfully", "success");
            auditLogService.logActivity("admin@rwtool.com", "Admin", "DOMAIN_ADDED", "Added new domain: test.com", "success");
            auditLogService.logActivity("ops@rwtool.com", "Ops", "FILE_UPLOADED", "Ops user uploaded file: test.pdf", "success");
            auditLogService.logActivity("admin@rwtool.com", "Admin", "FILE_ROUTED", "Admin sent file to destination: report.pdf", "success");
            
            return ResponseEntity.ok("Test audit logs created successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to create test audit logs: " + e.getMessage());
        }
    }
}
