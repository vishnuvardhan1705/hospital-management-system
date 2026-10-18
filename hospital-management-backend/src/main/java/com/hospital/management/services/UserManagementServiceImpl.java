package com.hospital.management.services;

import java.util.List;

import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hospital.management.dto.AssignRoleRequest;
import com.hospital.management.dto.CreateUserRequest;
import com.hospital.management.dto.ResetPasswordRequest;
import com.hospital.management.dto.UpdateUserRequest;
import com.hospital.management.dto.UserResponse;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.entity.UserRole;
import com.hospital.management.repository.RoleRepository;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.repository.UserRoleRepository;

import jakarta.transaction.Transactional;

@Service
public class UserManagementServiceImpl implements UserManagementService {

    private  UserRepository userRepository;
    private  RoleRepository roleRepository;
    private  UserRoleRepository userRoleRepository;
    private  PasswordEncoder passwordEncoder;
	
	public UserManagementServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
			UserRoleRepository userRoleRepository, PasswordEncoder passwordEncoder) {
		super();
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userRoleRepository = userRoleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setStatus("ACTIVE");

        User savedUser = userRepository.save(user);

        if (request.getRoleIds() != null) {
            for (Long roleId : request.getRoleIds()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() ->new IllegalArgumentException("Role not found: " + roleId));

                UserRole userRole = new UserRole();
                userRole.setUser(savedUser);
                userRole.setRole(role);

                savedUser.getUserRoles().add(userRole);
            }

            savedUser = userRepository.save(savedUser);
        }

        return toResponse(savedUser);
	}

	@Override
	@Transactional
	public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
	}

	@Override
	public UserResponse getUserById(Long userId) {
		return toResponse(findUser(userId));
	}

	@Override
	public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = findUser(userId);

        userRepository.findByEmail(request.getEmail())
                .filter(existing -> !existing.getUserId().equals(userId))
                .ifPresent(existing -> {throw new IllegalArgumentException("Email already exists");
                });

        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        return toResponse(userRepository.save(user));
	}

	@Override
	public UserResponse changeUserStatus(Long userId, String status) {
        if (!"ACTIVE".equals(status) && !"INACTIVE".equals(status)) {
            throw new IllegalArgumentException("Status must be ACTIVE or INACTIVE");
        }

        User user = findUser(userId);
        user.setStatus(status);

        return toResponse(userRepository.save(user));
	}

	@Override
	public void resetPassword(Long userId, ResetPasswordRequest request) {
        User user = findUser(userId);
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

	}

	@Override
	public List<String> getUserRoles(Long userId) {
		User user = findUser(userId);
		 
        return user.getUserRoles()
                .stream()
                .map(userRole -> userRole.getRole().getRoleName())
                .toList();
	}

	@Override
	public UserResponse assignRole(Long userId, AssignRoleRequest request) {
        User user = findUser(userId);

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Role not found"));

        boolean alreadyAssigned =
                userRoleRepository.existsByUserUserIdAndRoleRoleId(
                        userId, request.getRoleId());

        if (alreadyAssigned) {
            throw new IllegalArgumentException(
                    "User already has this role");
        }

        UserRole userRole = new UserRole();
        userRole.setUser(user);
        userRole.setRole(role);

        user.getUserRoles().add(userRole);
        return toResponse(userRepository.save(user));
	}
	
    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found: " + userId));
    }

    private UserResponse toResponse(User user) {
        List<String> roles = user.getUserRoles()
                .stream()
                .map(userRole -> userRole.getRole().getRoleName())
                .toList();

        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getMobileNumber(),
                user.getFirstName(),
                user.getLastName(),
                user.getStatus(),
                roles
        );
    }

}
