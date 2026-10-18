package com.hospital.management.controllers;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import com.hospital.management.dto.ChangePasswordRequest;
import com.hospital.management.dto.LoginRequest;
import com.hospital.management.dto.LoginResponse;
import com.hospital.management.entity.User;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.security.JwtService;
import com.hospital.management.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
	
	private AuthService authService;
	private UserRepository userRepository;
	private JwtService jwtService;
	
	public AuthController(AuthService authService, UserRepository userRepository, JwtService jwtService) {
		super();
		this.authService = authService;
		this.userRepository = userRepository;
		this.jwtService = jwtService;
	}
	
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } 
        catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(
                Map.of("message","Logout acknowledged. Remove the token from the client."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @AuthenticationPrincipal UserDetails userDetails) {

        String newToken = jwtService.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(
                Map.of(
                        "token", newToken,
                        "tokenType", "Bearer",
                        "expiresIn", 3600));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody ChangePasswordRequest request) {
        try {
            authService.changePassword(
                    userDetails.getUsername(),
                    request.getCurrentPassword(),
                    request.getNewPassword());

            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow();

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("userId", user.getUserId());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("mobileNumber", user.getMobileNumber());
        profile.put("firstName", user.getFirstName());
        profile.put("lastName", user.getLastName());
        profile.put("status", user.getStatus());
        profile.put("roles", user.getUserRoles().stream()
                .map(userRole -> userRole.getRole().getRoleName())
                .toList());

        return ResponseEntity.ok(profile);
    }

}
