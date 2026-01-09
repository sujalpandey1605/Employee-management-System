package com.emtps.auth.service.impl;

import com.emtps.auth.dto.AuthResponse;
import com.emtps.auth.dto.LoginRequest;
import com.emtps.auth.dto.SignupRequest;
import com.emtps.auth.model.User;
import com.emtps.auth.service.AuthService;
import com.emtps.auth.service.JwtService;
import com.emtps.auth.service.KafkaProducerService;
import com.emtps.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final KafkaProducerService kafkaProducerService;

    @Override
    public AuthResponse signup(SignupRequest request) {
        User user = User.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        try {
            System.out.println("DEBUG: Saving user to database...");
            user = userService.saveUser(user);
            System.out.println("DEBUG: User saved successfully: " + user.getUserId());
        } catch (Exception e) {
            System.err.println("DEBUG ERROR: Failed to save user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        
        try {
            System.out.println("DEBUG: Sending Kafka message...");
            kafkaProducerService.sendMessage("user-created-topic", user);
            System.out.println("DEBUG: Kafka message sent.");
        } catch (Exception e) {
            System.err.println("DEBUG ERROR: Failed to send Kafka message: " + e.getMessage());
        }

        System.out.println("DEBUG: Generating token for user: " + user.getUserId());
        String token = jwtService.generateToken(userService.loadUserByUsername(user.getUserId()));

        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .name(user.getName())
                .role(user.getRole())
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            System.out.println("DEBUG: Attempting authentication for user: " + request.getUserId());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUserId(), request.getPassword())
            );
            System.out.println("DEBUG: Authentication successful for user: " + request.getUserId());
        } catch (Exception e) {
            System.err.println("DEBUG ERROR: Authentication failed: " + e.getMessage());
            throw e;
        }

        try {
            System.out.println("DEBUG: Fetching user details from database...");
            User user = userService.findByUserId(request.getUserId());
            System.out.println("DEBUG: Generating token for user: " + user.getUserId());
            String token = jwtService.generateToken(userService.loadUserByUsername(user.getUserId()));

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getUserId())
                    .name(user.getName())
                    .role(user.getRole())
                    .message("Login successful")
                    .build();
        } catch (Exception e) {
            System.err.println("DEBUG ERROR: Post-authentication failure: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
