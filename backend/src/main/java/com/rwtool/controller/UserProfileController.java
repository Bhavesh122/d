package com.rwtool.controller;

import com.rwtool.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserProfileService.Profile> get(@PathVariable String email) {
        return ResponseEntity.ok(userProfileService.getOrCreate(email));
    }

    @PutMapping("/{email}")
    public ResponseEntity<UserProfileService.Profile> update(
            @PathVariable String email,
            @RequestBody UserProfileService.Profile incoming
    ) {
        return ResponseEntity.ok(userProfileService.update(email, incoming));
    }

    @PostMapping("/{email}/downloads/increment")
    public ResponseEntity<Map<String, Object>> incrementDownloads(
            @PathVariable String email,
            @RequestParam(name = "count", defaultValue = "1") int count
    ) {
        for (int i = 0; i < Math.max(count, 1); i++) {
            userProfileService.incrementDownloads(email);
        }
        Map<String, Object> res = new HashMap<>();
        res.put("status", "ok");
        res.put("reportsDownloaded", userProfileService.getOrCreate(email).reportsDownloaded);
        return ResponseEntity.ok(res);
    }
}
