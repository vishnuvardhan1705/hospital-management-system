package com.hospital.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.management.entity.UserRole;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    boolean existsByUserUserIdAndRoleRoleId(Long userId, Long roleId);
}
