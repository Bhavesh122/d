package com.rwtool.controller;

import com.rwtool.service.RoutingService;
import com.rwtool.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
@RequestMapping("/api/routing")
public class RoutingController {

    private final RoutingService routingService;
    
    @Autowired
    private AuditLogService auditLogService;

    public RoutingController(RoutingService routingService) {
        this.routingService = routingService;
    }

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runNow() {
        try {
            Map<String, Object> result = routingService.runRoutingNow();
            auditLogService.logActivity(
                "system", // TODO: Get actual admin email from security context
                "Admin",
                "BULK_ROUTING_EXECUTED",
                "Admin executed bulk file routing",
                "success"
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            auditLogService.logActivity(
                "system",
                "Admin",
                "BULK_ROUTING_FAILED",
                "Failed to execute bulk file routing: " + e.getMessage(),
                "failed"
            );
            throw e;
        }
    }

    @PostMapping("/dry-run")
    public ResponseEntity<List<RoutingService.DryRunDecision>> dryRun(@RequestBody List<String> fileNames) {
        return ResponseEntity.ok(routingService.dryRunDecisions(fileNames));
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<Map<String, Object>>> listIncoming() {
        return ResponseEntity.ok(routingService.listIncomingFiles());
    }

    @PostMapping("/route-one")
    public ResponseEntity<Map<String, Object>> routeOne(@RequestParam("fileName") String fileName) {
        System.out.println("=== FILE ROUTING DEBUG ===");
        System.out.println("Routing file: " + fileName);
        try {
            Map<String, Object> result = routingService.routeSingle(fileName);
            System.out.println("Routing result: " + result);
            boolean moved = result.get("moved") != null && (Boolean) result.get("moved");
            System.out.println("File moved: " + moved);
            
            if (moved) {
                System.out.println("Logging successful file routing...");
                auditLogService.logActivity(
                    "system", // TODO: Get actual admin email from security context
                    "Admin",
                    "FILE_ROUTED",
                    "Admin sent file to destination: " + fileName,
                    "success"
                );
                System.out.println("Audit log created for successful routing");
            } else {
                String reason = result.get("reason") != null ? result.get("reason").toString() : "Unknown reason";
                System.out.println("Logging failed file routing, reason: " + reason);
                auditLogService.logActivity(
                    "system",
                    "Admin",
                    "FILE_ROUTING_FAILED",
                    "Failed to route file: " + fileName + ". Reason: " + reason,
                    "failed"
                );
                System.out.println("Audit log created for failed routing");
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.out.println("Exception during routing: " + e.getMessage());
            auditLogService.logActivity(
                "system",
                "Admin",
                "FILE_ROUTING_ERROR",
                "Error routing file: " + fileName + ". Error: " + e.getMessage(),
                "failed"
            );
            System.out.println("Audit log created for routing error");
            throw e;
        }
    }
}
