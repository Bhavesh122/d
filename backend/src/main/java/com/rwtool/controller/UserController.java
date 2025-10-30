package com.rwtool.controller;

import com.rwtool.model.User;
import com.rwtool.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{email:.+}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                        "email", u.getEmail(),
                        "name", u.getFullName(),
                        "domain", u.getDomain()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found")));
    }
}
