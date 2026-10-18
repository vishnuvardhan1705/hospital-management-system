package com.hospital.management.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.Role;
import com.hospital.management.repository.RoleRepository;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
	
    private final RoleRepository roleRepository;

    public RoleController(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
