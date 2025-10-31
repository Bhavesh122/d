package com.rwtool.controller;

import com.rwtool.dto.PageResponse;
import com.rwtool.dto.PathConfigRequest;
import com.rwtool.model.PathConfig;
import com.rwtool.service.PathConfigService;
import com.rwtool.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paths")
public class PathConfigController {

    private final PathConfigService service;
    
    @Autowired
    private AuditLogService auditLogService;

    public PathConfigController(PathConfigService service) {
        this.service = service;
    }

    @GetMapping
    public PageResponse<PathConfig> list(@RequestParam(required = false) String search,
                                         @RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "10") int pageSize) {
        return service.list(search, page, pageSize);
    }

    @PostMapping
    public ResponseEntity<PathConfig> create(@RequestBody PathConfigRequest req) {
        try {
            PathConfig created = service.create(req);
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "PATH_CONFIG_CREATED",
                "Created path configuration: " + created.getPrefix(),
                "success"
            );
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "PATH_CONFIG_CREATE_FAILED",
                "Failed to create path configuration: " + e.getMessage(),
                "failed"
            );
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PathConfig> update(@PathVariable Long id, @RequestBody PathConfigRequest req) {
        try {
            PathConfig updated = service.update(id, req);
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "PATH_CONFIG_UPDATED",
                "Updated path configuration: " + updated.getPrefix(),
                "success"
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "PATH_CONFIG_UPDATE_FAILED",
                "Failed to update path configuration: " + e.getMessage(),
                "failed"
            );
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PathConfig> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            // Get path config before deletion for audit log
            PathConfig pathConfig = service.get(id).orElse(null);
            String prefix = pathConfig != null ? pathConfig.getPrefix() : "Unknown";
            service.delete(id);
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "PATH_CONFIG_DELETED",
                "Deleted path configuration: " + prefix,
                "success"
            );
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "PATH_CONFIG_DELETE_FAILED",
                "Failed to delete path configuration: " + e.getMessage(),
                "failed"
            );
            throw e;
        }
    }
}
