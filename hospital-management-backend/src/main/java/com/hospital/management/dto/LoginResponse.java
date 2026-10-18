package com.hospital.management.dto;

import java.util.List;

public class LoginResponse {

    private String token;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String username;
    private List<String> roles;
    
    public LoginResponse() {
    	
    }

	public LoginResponse(String token, String tokenType, long expiresIn, Long userId, String username,
			List<String> roles) {
		super();
		this.token = token;
		this.tokenType = tokenType;
		this.expiresIn = expiresIn;
		this.userId = userId;
		this.username = username;
		this.roles = roles;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public long getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(long expiresIn) {
		this.expiresIn = expiresIn;
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

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
    
	
}
