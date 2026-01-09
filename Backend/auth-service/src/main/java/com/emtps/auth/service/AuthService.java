package com.emtps.auth.service;

import com.emtps.auth.dto.AuthResponse;
import com.emtps.auth.dto.LoginRequest;
import com.emtps.auth.dto.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);
    AuthResponse login(LoginRequest request);
}
