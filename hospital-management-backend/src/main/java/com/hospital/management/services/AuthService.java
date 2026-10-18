package com.hospital.management.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hospital.management.entity.User;
import com.hospital.management.dto.LoginRequest;
import com.hospital.management.dto.LoginResponse;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.security.JwtService;

@Service
public class AuthService {
	private AuthenticationManager authenticationManager;
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private JwtService jwtService;
	
	public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
			PasswordEncoder passwordEncoder, JwtService jwtService) {
		super();
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}
	
	public LoginResponse login(LoginRequest request) {
		
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
		
		User user = userRepository.findByUsername(request.getUsername()).orElseThrow(()->
							new RuntimeException("User not found"));
		
		user.setLastLoginAt(LocalDateTime.now());
		userRepository.save(user);
		
		String token = jwtService.generateToken(user.getUsername());
		
		List<String> roles = user.getUserRoles()
		        .stream()
		        .map(userRole -> userRole.getRole().getRoleName())
		        .toList();
		
		return new LoginResponse(
				token,
				"Bearer",
				3600,
				user.getUserId(),
				user.getUsername(),
				roles);
	}

    public void changePassword(String username,String currentPassword,String newPassword) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
