package com.rwtool.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FolderService {

    @Value("${app.storage.local.baseDir:}")
    private String localBaseDir;

    /**
     * List all folders in the reports directory
     * Returns folder names like: Finance, Risk, Compliance, etc.
     */
    public List<String> listReportFolders() {
        if (localBaseDir == null || localBaseDir.trim().isEmpty()) {
            return List.of();
        }
        
        Path reportsPath = Paths.get(localBaseDir).resolve("reports");
        if (!Files.exists(reportsPath) || !Files.isDirectory(reportsPath)) {
            return List.of();
        }
        
        try (Stream<Path> paths = Files.list(reportsPath)) {
            return paths
                .filter(Files::isDirectory)
                .map(p -> p.getFileName().toString())
                .sorted()
                .collect(Collectors.toList());
        } catch (IOException e) {
            return List.of();
        }
    }

    /**
     * List all files in a specific folder
     * @param folderName - folder name like "Finance", "Risk", etc.
     * @return List of file information maps
     */
    public List<Map<String, Object>> listFilesInFolder(String folderName) {
        if (localBaseDir == null || localBaseDir.trim().isEmpty()) {
            return List.of();
        }
        
        Path folderPath = Paths.get(localBaseDir).resolve("reports").resolve(folderName);
        if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
            return List.of();
        }
        
        try (Stream<Path> paths = Files.list(folderPath)) {
            return paths
                .filter(Files::isRegularFile)
                .map(p -> {
                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("name", p.getFileName().toString());
                    fileInfo.put("folder", folderName);
                    try {
                        fileInfo.put("size", Files.size(p));
                        fileInfo.put("modified", Files.getLastModifiedTime(p).toMillis());
                    } catch (IOException ignored) {}
                    return fileInfo;
                })
                .collect(Collectors.toList());
        } catch (IOException e) {
            return List.of();
        }
    }

    /**
     * List files from multiple folders (for user's accessible folders)
     * @param folderNames - list of folder names user has access to
     * @return Combined list of all files from those folders
     */
    public List<Map<String, Object>> listFilesFromFolders(List<String> folderNames) {
        List<Map<String, Object>> allFiles = new ArrayList<>();
        for (String folder : folderNames) {
            allFiles.addAll(listFilesInFolder(folder));
        }
        return allFiles;
    }
}
