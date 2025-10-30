package com.rwtool.service;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class FavoriteService {
    // key: userId, value: set of composite keys "folder|fileName"
    private final ConcurrentHashMap<String, Set<String>> favorites = new ConcurrentHashMap<>();

    private String key(String folder, String fileName) {
        return folder + "|" + fileName;
    }

    public Set<String> list(String userId) {
        return favorites.getOrDefault(userId, Collections.emptySet());
    }

    public void add(String userId, String folder, String fileName) {
        favorites.computeIfAbsent(userId, u -> ConcurrentHashMap.newKeySet()).add(key(folder, fileName));
    }

    public void remove(String userId, String folder, String fileName) {
        Set<String> set = favorites.get(userId);
        if (set != null) {
            set.remove(key(folder, fileName));
            if (set.isEmpty()) {
                favorites.remove(userId);
            }
        }
    }

    public boolean isFavorite(String userId, String folder, String fileName) {
        return favorites.getOrDefault(userId, Collections.emptySet()).contains(key(folder, fileName));
    }
}
