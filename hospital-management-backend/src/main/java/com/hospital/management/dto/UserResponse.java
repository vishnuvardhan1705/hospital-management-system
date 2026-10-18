package com.hospital.management.dto;

import java.util.List;

public class UserResponse {

    private Long userId;
    private String username;
    private String email;
    private String mobileNumber;
    private String firstName;
    private String lastName;
    private String status;
    private List<String> roles;
    
    
	public UserResponse(Long userId, String username, String email, String mobileNumber, String firstName,
			String lastName, String status, List<String> roles) {
		super();
		this.userId = userId;
		this.username = username;
		this.email = email;
		this.mobileNumber = mobileNumber;
		this.firstName = firstName;
		this.lastName = lastName;
		this.status = status;
		this.roles = roles;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMobileNumber() {
		return mobileNumber;
	}
	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public List<String> getRoles() {
		return roles;
	}
	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
    
    
}
