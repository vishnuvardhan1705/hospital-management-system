package com.hospital.management.dto;

import jakarta.validation.constraints.NotNull;

public class AssignRoleRequest {

    @NotNull
    private Long roleId;

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
}
