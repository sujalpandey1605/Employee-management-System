package com.emtps.auth.security;

import com.emtps.auth.model.Role;
import com.emtps.auth.model.User;
import com.emtps.auth.service.JwtService;
import com.emtps.auth.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user;
        try {
            user = (User) userService.loadUserByUsername(email);
        } catch (Exception e) {
            user = User.builder()
                    .userId(email)
                    .name(name)
                    .email(email)
                    .password("")
                    .role(Role.EMPLOYEE)
                    .active(true)
                    .build();
            userService.saveUser(user);
        }

        String token = jwtService.generateToken(userService.loadUserByUsername(user.getUserId()));

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/oauth2/success")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
