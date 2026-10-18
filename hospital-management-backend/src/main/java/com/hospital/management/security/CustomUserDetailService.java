package com.hospital.management.security;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.User;
import com.hospital.management.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {

	private UserRepository userRepository;
	
	public CustomUserDetailService(UserRepository userRepository) {
		super();
		this.userRepository = userRepository;
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		User user = userRepository.findByUsername(username).orElseThrow(() ->
		                new UsernameNotFoundException("User not found"));
		user.getUserRoles().forEach(userRole ->
	    System.out.println(
	        "Username: " + user.getUsername()
	        + ", Role: " + userRole.getRole().getRoleName()
	    )
	);
		return org.springframework.security.core.userdetails.User
				.withUsername(user.getUsername())
				.password(user.getPassword())
				.authorities(
		                user.getUserRoles().stream()
		                    .map(userRole ->
		                        "ROLE_" + userRole.getRole().getRoleName())
		                    .toArray(String[]::new)
		            )
		            .disabled(!"ACTIVE".equalsIgnoreCase(user.getStatus()))
				.build();
	}

}
