package com.emtps.auth.dto;

import com.emtps.auth.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private Role role;
    private String message;
}
