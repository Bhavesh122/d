package com.rwtool.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserProfileService {
    public static class Profile {
        public String name;
        public String email;
        public String phone;
        public String domain;
        public String department;
        public int reportsDownloaded;
        public int favoriteReports;
    }

    private final Map<String, Profile> store = new ConcurrentHashMap<>();

    public Profile getOrCreate(String email) {
        return store.computeIfAbsent(email, e -> {
            Profile p = new Profile();
            p.email = e;
            p.name = "Subscriber";
            p.phone = "";
            p.domain = "";
            p.department = "";
            p.reportsDownloaded = 0;
            p.favoriteReports = 0;
            return p;
        });
    }

    public Profile update(String email, Profile incoming) {
        Profile existing = getOrCreate(email);
        if (incoming.name != null) existing.name = incoming.name;
        if (incoming.phone != null) existing.phone = incoming.phone;
        if (incoming.domain != null) existing.domain = incoming.domain;
        if (incoming.department != null) existing.department = incoming.department;
        // stats may be updated by system flows but allow overriding if provided
        if (incoming.reportsDownloaded >= 0) existing.reportsDownloaded = incoming.reportsDownloaded;
        if (incoming.favoriteReports >= 0) existing.favoriteReports = incoming.favoriteReports;
        return existing;
    }

    // Simple helpers to reflect activity
    public void incrementDownloads(String email) {
        Profile p = getOrCreate(email);
        p.reportsDownloaded++;
    }

    public void setFavorites(String email, int count) {
        Profile p = getOrCreate(email);
        p.favoriteReports = count;
    }
}
