package com.hospital.management.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AssignRoleRequest;
import com.hospital.management.dto.CreateUserRequest;
import com.hospital.management.dto.ResetPasswordRequest;
import com.hospital.management.dto.UpdateUserRequest;
import com.hospital.management.dto.UserResponse;
import com.hospital.management.services.UserManagementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

	private UserManagementService userManagementService;

	public UserManagementController(UserManagementService userManagementService) {
		super();
		this.userManagementService = userManagementService;
	}
	
	@PostMapping
	public UserResponse createUser( @Valid @RequestBody CreateUserRequest request) {
	    return userManagementService.createUser(request);
	}

	@GetMapping
	public List<UserResponse> getAllUsers() {
	    return userManagementService.getAllUsers();
	}

	@GetMapping("/{userId}")
	public UserResponse getUserById(@PathVariable Long userId) {
	    return userManagementService.getUserById(userId);
	}

	@PutMapping("/{userId}")
	public UserResponse updateUser( @PathVariable Long userId,@Valid @RequestBody UpdateUserRequest request) {
	    return userManagementService.updateUser(userId, request);
	}

	@PutMapping("/{userId}/status")
	public UserResponse changeUserStatus( @PathVariable Long userId,@RequestParam String status) {
	    return userManagementService.changeUserStatus(userId, status);
	}

	@PutMapping("/{userId}/password")
	public Map<String, String> resetPassword(
	        @PathVariable Long userId,
	        @Valid @RequestBody ResetPasswordRequest request) {

	    userManagementService.resetPassword(userId, request);

	    return Map.of("message", "Password reset successfully");
	}

	@GetMapping("/{userId}/roles")
	public List<String> getUserRoles(@PathVariable Long userId) {
	    return userManagementService.getUserRoles(userId);
	}

	@PostMapping("/{userId}/roles")
	public UserResponse assignRole(
	        @PathVariable Long userId,
	        @Valid @RequestBody AssignRoleRequest request) {
	    return userManagementService.assignRole(userId, request);
	}
}

