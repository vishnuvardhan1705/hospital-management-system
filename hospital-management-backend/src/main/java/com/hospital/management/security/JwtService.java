package com.hospital.management.security;

import java.util.Base64.Decoder;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	@Value("${jwt.secret}")
	private String secret;
	
	@Value("${jwt.expiration}")
	private long expiration;
	
	private SecretKey getSigningKey() {
		
		byte[] keyBytes = Decoders.BASE64.decode(secret);
		return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public String generateToken(String username) {
		
		Date now = new Date();
		Date expiry = new Date(now.getTime()+expiration);
		
		return Jwts.builder()
				.subject(username)
				.issuedAt(now)
				.expiration(expiry)
				.signWith(getSigningKey()).compact();
	}
	
	public String extractUsername(String token) {
		
		return extractClaims(token).getSubject();
	}
	
	public boolean isTokenValid(String token, String username) {
		
		String tokenUsername = extractUsername(token);
		
		return tokenUsername.equals(username) && extractClaims(token).getExpiration().after(new Date());
	}
	
	public Claims extractClaims(String token) {
		
		return Jwts.parser()
				.verifyWith(getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
