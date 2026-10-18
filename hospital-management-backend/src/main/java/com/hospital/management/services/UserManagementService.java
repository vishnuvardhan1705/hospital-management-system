package com.hospital.management.services;

import java.util.List;

import com.hospital.management.dto.AssignRoleRequest;
import com.hospital.management.dto.CreateUserRequest;
import com.hospital.management.dto.ResetPasswordRequest;
import com.hospital.management.dto.UpdateUserRequest;
import com.hospital.management.dto.UserResponse;

public interface UserManagementService {

    public UserResponse createUser(CreateUserRequest request);

    public List<UserResponse> getAllUsers();

    public UserResponse getUserById(Long userId);

    public UserResponse updateUser(Long userId, UpdateUserRequest request);

    public UserResponse changeUserStatus(Long userId, String status);

    public void resetPassword( Long userId, ResetPasswordRequest request);

    public List<String> getUserRoles(Long userId);

    public UserResponse assignRole(Long userId, AssignRoleRequest request);
}
