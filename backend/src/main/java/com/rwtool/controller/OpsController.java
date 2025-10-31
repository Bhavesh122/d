package com.rwtool.controller;

import com.rwtool.service.StorageService;
import com.rwtool.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "false")
@RequestMapping("/api/ops")
public class OpsController {

    private final StorageService storageService;
    
    @Autowired
    private AuditLogService auditLogService;

    public OpsController(StorageService storageService) {
        this.storageService = storageService;
    }

    // Upload a file into the local incoming folder (demo/local mode)
    // form-data: file=<binary>, fileName(optional)="Finance__something.pdf"
    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importToIncoming(@RequestParam("file") MultipartFile file,
                                                                @RequestParam(value = "fileName", required = false) String fileName) throws Exception {
        try {
            String savedPath = storageService.saveToIncoming(file, fileName);
            String actualFileName = fileName != null ? fileName : file.getOriginalFilename();
            auditLogService.logActivity(
                "system", // TODO: Get actual ops user email from security context
                "Ops",
                "FILE_UPLOADED",
                "Ops user uploaded file: " + actualFileName,
                "success"
            );
            Map<String, Object> resp = new HashMap<>();
            resp.put("saved", true);
            resp.put("path", savedPath);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            String actualFileName = fileName != null ? fileName : (file != null ? file.getOriginalFilename() : "unknown");
            auditLogService.logActivity(
                "system",
                "Ops",
                "FILE_UPLOAD_FAILED",
                "Failed to upload file: " + actualFileName + ". Error: " + e.getMessage(),
                "failed"
            );
            throw e;
        }
    }

    // List files under baseDir/storage (for OPS to choose to import)
    @GetMapping("/storage")
    public ResponseEntity<List<Map<String, Object>>> listStorage() throws Exception {
        return ResponseEntity.ok(storageService.listStorageFiles());
    }

    // Import a single file from storage to incoming
    @PostMapping("/import-storage")
    public ResponseEntity<Map<String, Object>> importFromStorage(@RequestParam("fileName") String fileName) throws Exception {
        try {
            Map<String, Object> result = storageService.importFromStorage(fileName);
            auditLogService.logActivity(
                "system", // TODO: Get actual ops user email from security context
                "Ops",
                "FILE_IMPORTED",
                "Ops user imported file from storage: " + fileName,
                "success"
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            auditLogService.logActivity(
                "system",
                "Ops",
                "FILE_IMPORT_FAILED",
                "Failed to import file from storage: " + fileName + ". Error: " + e.getMessage(),
                "failed"
            );
            throw e;
        }
    }
}
