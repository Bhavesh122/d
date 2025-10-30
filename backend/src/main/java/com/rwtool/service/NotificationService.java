package com.rwtool.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    public static class Notification {
        public String id;
        public String userId;
        public String type; // accepted | rejected | file
        public String title;
        public String message;
        public long time; // epoch millis
        public boolean read;
    }

    private final Map<String, Deque<Notification>> store = new ConcurrentHashMap<>();

    public List<Notification> list(String userId) {
        Deque<Notification> q = store.getOrDefault(userId, new ArrayDeque<>());
        return q.stream().collect(Collectors.toList());
    }

    public Notification add(String userId, String type, String title, String message) {
        Notification n = new Notification();
        n.id = UUID.randomUUID().toString();
        n.userId = userId;
        n.type = type;
        n.title = title;
        n.message = message;
        n.time = Instant.now().toEpochMilli();
        n.read = false;
        store.computeIfAbsent(userId, k -> new ArrayDeque<>()).addFirst(n);
        return n;
    }

    public boolean markRead(String userId, String id) {
        Deque<Notification> q = store.get(userId);
        if (q == null) return false;
        for (Notification n : q) {
            if (Objects.equals(n.id, id)) { n.read = true; return true; }
        }
        return false;
    }

    public void markAllRead(String userId) {
        Deque<Notification> q = store.get(userId);
        if (q == null) return;
        for (Notification n : q) n.read = true;
    }

    public boolean delete(String userId, String id) {
        Deque<Notification> q = store.get(userId);
        if (q == null) return false;
        return q.removeIf(n -> Objects.equals(n.id, id));
    }

    public void clear(String userId) {
        store.remove(userId);
    }
}
