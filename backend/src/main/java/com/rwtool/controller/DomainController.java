package com.rwtool.controller;

import com.rwtool.model.Domain;
import com.rwtool.service.DomainService;
import com.rwtool.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domains")
@CrossOrigin(origins = "http://localhost:3000")
public class DomainController {

    @Autowired
    private DomainService domainService;
    
    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Domain>> getAllDomains() {
        try {
            List<Domain> domains = domainService.getAllDomains();
            return ResponseEntity.ok(domains);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Domain> getDomainById(@PathVariable String id) {
        try {
            Domain domain = domainService.getDomainById(id);
            return ResponseEntity.ok(domain);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> addDomain(@RequestBody Domain domain) {
        try {
            Domain savedDomain = domainService.addDomain(domain);
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "DOMAIN_ADDED",
                "Added new domain: " + savedDomain.getName(),
                "success"
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDomain);
        } catch (RuntimeException e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "DOMAIN_ADD_FAILED",
                "Failed to add domain: " + e.getMessage(),
                "failed"
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDomain(@PathVariable String id, @RequestBody Domain domain) {
        try {
            Domain updatedDomain = domainService.updateDomain(id, domain);
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "DOMAIN_UPDATED",
                "Updated domain: " + updatedDomain.getName(),
                "success"
            );
            return ResponseEntity.ok(updatedDomain);
        } catch (RuntimeException e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "DOMAIN_UPDATE_FAILED",
                "Failed to update domain: " + e.getMessage(),
                "failed"
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDomain(@PathVariable String id) {
        try {
            // Get domain name before deletion for audit log
            Domain domain = domainService.getDomainById(id);
            String domainName = domain.getName();
            domainService.deleteDomain(id);
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "DOMAIN_DELETED",
                "Deleted domain: " + domainName,
                "success"
            );
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "DOMAIN_DELETE_FAILED",
                "Failed to delete domain: " + e.getMessage(),
                "failed"
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
