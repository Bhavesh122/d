package com.rwtool.dto;

import com.rwtool.model.AuditLog;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class AuditLogDTO {
    
    private Long id;
    private String timestamp;
    private String user;
    private String role;
    private String action;
    private String details;
    private String status;
    
    // Constructors
    public AuditLogDTO() {}
    
    public AuditLogDTO(AuditLog auditLog) {
        this.id = auditLog.getId();
        this.timestamp = auditLog.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        this.user = auditLog.getUserEmail();
        this.role = auditLog.getRole();
        this.action = auditLog.getAction();
        this.details = auditLog.getDetails();
        this.status = auditLog.getStatus();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getUser() {
        return user;
    }
    
    public void setUser(String user) {
        this.user = user;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getAction() {
        return action;
    }
    
    public void setAction(String action) {
        this.action = action;
    }
    
    public String getDetails() {
        return details;
    }
    
    public void setDetails(String details) {
        this.details = details;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
}
