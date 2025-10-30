package com.rwtool.controller;

import com.rwtool.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotificationService.Notification>> list(@RequestParam String userId) {
        return ResponseEntity.ok(service.list(userId));
    }

    @PostMapping
    public ResponseEntity<NotificationService.Notification> add(@RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String type = body.getOrDefault("type", "info");
        String title = body.getOrDefault("title", "Notification");
        String message = body.getOrDefault("message", "");
        return ResponseEntity.ok(service.add(userId, type, title, message));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllRead(@RequestParam String userId) {
        service.markAllRead(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("status", "ok");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<Map<String, Object>> markRead(@RequestParam String userId, @PathVariable String id) {
        boolean ok = service.markRead(userId, id);
        Map<String, Object> res = new HashMap<>();
        res.put("status", ok ? "ok" : "not_found");
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@RequestParam String userId, @PathVariable String id) {
        boolean ok = service.delete(userId, id);
        Map<String, Object> res = new HashMap<>();
        res.put("status", ok ? "ok" : "not_found");
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, Object>> clear(@RequestParam String userId) {
        service.clear(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("status", "ok");
        return ResponseEntity.ok(res);
    }
}
