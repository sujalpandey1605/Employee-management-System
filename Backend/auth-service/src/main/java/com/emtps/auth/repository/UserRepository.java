package com.emtps.auth.repository;

import com.emtps.auth.model.Role;
import com.emtps.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(String userId);
    List<User> findByRole(Role role);
    List<User> findByUserIdContainingOrNameContaining(String userId, String name);
    List<User> findByRoleAndUserIdContainingOrRoleAndNameContaining(Role role, String userId, Role role2, String name);
}
