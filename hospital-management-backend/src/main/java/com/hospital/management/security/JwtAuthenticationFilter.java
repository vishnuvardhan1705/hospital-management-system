package com.hospital.management.security;

import java.io.IOException;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private JwtService jwtService;
	private CustomUserDetailService customUserDetailService;
	
	public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailService customUserDetailService) {
		super();
		this.jwtService = jwtService;
		this.customUserDetailService = customUserDetailService;
	}
	
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
	    return request.getServletPath().equals("/api/auth/login");
	}


	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String authHeader = request.getHeader("Authorization");
		
		if(authHeader == null || !authHeader.startsWith("Bearer ")) {
			
			filterChain.doFilter(request, response);
			return;
		}
		
		String token = authHeader.substring(7);
		
		try {
			
			String username = jwtService.extractUsername(token);
			
			if(SecurityContextHolder.getContext().getAuthentication()==null) {
				UserDetails userDetails = customUserDetailService.loadUserByUsername(username);
				
				if(jwtService.isTokenValid(token, userDetails.getUsername()) && userDetails.isEnabled()) {
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
					
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
		}
		catch(JwtException | IllegalArgumentException ex) {
			
			SecurityContextHolder.clearContext();
			response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"User not found");
			
			return;
		}
		catch (UsernameNotFoundException ex) {
		    SecurityContextHolder.clearContext();
		    response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"User not found");
		    return;
		}
		
		filterChain.doFilter(request, response);
	}

}
