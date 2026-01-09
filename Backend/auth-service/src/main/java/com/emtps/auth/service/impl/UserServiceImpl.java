package com.emtps.auth.service.impl;

import com.emtps.auth.model.Role;
import com.emtps.auth.model.User;
import com.emtps.auth.repository.UserRepository;
import com.emtps.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User findByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<User> filterUsers(String role, String query) {
        if (role != null && !role.isEmpty()) {
            Role userRole = Role.valueOf(role.toUpperCase());
            if (query != null && !query.isEmpty()) {
                return userRepository.findByRoleAndUserIdContainingOrRoleAndNameContaining(userRole, query, userRole, query);
            }
            return userRepository.findByRole(userRole);
        }
        if (query != null && !query.isEmpty()) {
            return userRepository.findByUserIdContainingOrNameContaining(query, query);
        }
        return getAllUsers();
    }

    @Override
    @Transactional
    public User updateUser(String userId, User userDetails) {
        User user = findByUserId(userId);
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setActive(userDetails.isActive());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        User user = findByUserId(userId);
        userRepository.delete(user);
    }

    @Override
    public byte[] exportUsersToCSV() {
        List<User> users = getAllUsers();
        StringBuilder csvContent = new StringBuilder();
        csvContent.append("User ID,Name,Email,Role,Status\n");

        for (User user : users) {
            csvContent.append(user.getUserId()).append(",")
                    .append(user.getName()).append(",")
                    .append(user.getEmail()).append(",")
                    .append(user.getRole()).append(",")
                    .append(user.isActive() ? "Active" : "Inactive").append("\n");
        }
        return csvContent.toString().getBytes();
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = findByUserId(userId);
        return new org.springframework.security.core.userdetails.User(
                user.getUserId(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
