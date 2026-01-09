package com.emtps.auth.controller;

import com.emtps.auth.model.User;
import com.emtps.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String query) {
        log.info("Admin fetching users with filters - role: {}, query: {}", role, query);
        return ResponseEntity.ok(userService.filterUsers(role, query));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        log.info("Admin creating new user: {}", user.getUserId());
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(userService.findByUserId(userId));
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User userDetails) {
        log.info("Admin updating user: {}", userId);
        return ResponseEntity.ok(userService.updateUser(userId, userDetails));
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        log.info("Admin deleting user: {}", userId);
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> exportUsers() {
        log.info("Admin exporting users to CSV");
        byte[] csvData = userService.exportUsersToCSV();
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=employees_report.csv")
                .header("Content-Type", "text/csv")
                .body(csvData);
    }
}
