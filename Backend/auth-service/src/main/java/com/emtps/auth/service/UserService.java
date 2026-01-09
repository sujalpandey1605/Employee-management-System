package com.emtps.auth.service;

import com.emtps.auth.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.util.List;

public interface UserService extends UserDetailsService {
    User saveUser(User user);
    User findByUserId(String userId);
    List<User> getAllUsers();
    List<User> filterUsers(String role, String query);
    User updateUser(String userId, User userDetails);
    void deleteUser(String userId);
    byte[] exportUsersToCSV();
}
