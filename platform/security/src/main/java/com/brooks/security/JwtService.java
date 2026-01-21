package com.brooks.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

public class JwtService {
  private final JwtConfig config;
  private final Key key;

  public JwtService(JwtConfig config) {
    this.config = config;
    this.key = Keys.hmacShaKeyFor(config.secret().getBytes(StandardCharsets.UTF_8));
  }

  public String issueAccessToken(UUID userId, String email) {
    Instant now = Instant.now();
    Instant expiresAt = now.plusSeconds(config.accessTtlSeconds());
    return Jwts.builder()
        .setSubject(userId.toString())
        .claim("email", email)
        .setIssuer(config.issuer())
        .setIssuedAt(Date.from(now))
        .setExpiration(Date.from(expiresAt))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public JwtClaims parseAccessToken(String token) {
    Claims claims = Jwts.parserBuilder()
        .setSigningKey(key)
        .requireIssuer(config.issuer())
        .build()
        .parseClaimsJws(token)
        .getBody();
    UUID userId = UUID.fromString(claims.getSubject());
    String email = claims.get("email", String.class);
    return new JwtClaims(userId, email);
  }
}
