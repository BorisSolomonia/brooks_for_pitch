# Brooks Security Guide

**Last Updated**: 2026-01-10
**Status**: In Progress
**Severity Levels**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## Table of Contents

1. [Security Overview](#security-overview)
2. [Fixed Vulnerabilities](#fixed-vulnerabilities)
3. [Remaining Vulnerabilities](#remaining-vulnerabilities)
4. [Security Best Practices](#security-best-practices)
5. [Secrets Management](#secrets-management)
6. [Authentication & Authorization](#authentication--authorization)
7. [Input Validation](#input-validation)
8. [Rate Limiting](#rate-limiting)
9. [Monitoring & Alerts](#monitoring--alerts)
10. [Incident Response](#incident-response)

---

## Security Overview

Brooks is a privacy-first proximity-based social notes platform. Security is paramount due to:

- **Location Data**: Proximity-based features require careful handling of location data
- **Social Relationships**: Access control based on friend/follower relationships
- **User-Generated Content**: Pins can contain text and links
- **Microservices Architecture**: Multiple services require secure inter-service communication

### Security Principles

1. **Privacy by Default**: Relationship preferences default to FALSE (deny)
2. **Least Privilege**: Access granted only when explicitly permitted
3. **Defense in Depth**: Multiple layers of security (validation, auth, ACLs)
4. **Fail-Safe**: Circuit breakers return deny-all on service failures
5. **Audit Trail**: All access attempts should be logged (TODO)

---

## Fixed Vulnerabilities

### ✅ 1. Exposed Secrets in Repository (CRITICAL)

**Issue**: `.env` file containing Auth0 credentials was tracked in git

**Fix Applied**:
- Created `.gitignore` file excluding `.env` and all secret files
- Created `.env.template` with placeholder values
- Updated `docker-compose.yml` to use environment variables with validation

**Action Required**:
```bash
# 1. Add .env to gitignore (DONE)
# 2. Remove .env from git history (USER ACTION)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (after backing up!)
git push origin --force --all

# 4. Rotate all secrets in Auth0 dashboard
```

### ✅ 2. Hardcoded Secrets in Docker Compose (CRITICAL)

**Issue**:
- JWT secret: `change-me-change-me-change-me-change`
- Database passwords: `auth_pass`, `social_pass`, etc.

**Fix Applied**:
- Updated `docker-compose.yml` to require secrets from `.env`:
  ```yaml
  BROOKS_JWT_SECRET: ${BROOKS_JWT_SECRET:?BROOKS_JWT_SECRET must be set in .env file}
  AUTH_DB_PASSWORD: ${AUTH_DB_PASSWORD:?AUTH_DB_PASSWORD must be set in .env file}
  ```
- Services will fail to start if secrets are not set

**Action Required**:
```bash
# Generate strong secrets
openssl rand -base64 32  # For JWT secret
openssl rand -base64 24  # For each DB password

# Add to .env file (never commit!)
echo "BROOKS_JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "AUTH_DB_PASSWORD=$(openssl rand -base64 24)" >> .env
# ... repeat for all services
```

### ✅ 3. Missing Input Validation (HIGH)

**Issue**: DTOs lacked comprehensive validation allowing invalid data

**Fix Applied**:
- Added Bean Validation annotations to all request DTOs:
  - `@NotBlank`, `@NotNull` for required fields
  - `@Size` for text length limits
  - `@DecimalMin`, `@DecimalMax` for coordinate ranges
  - `@Future` for expiration dates
  - `@Min` for positive integers

**Example**:
```java
public record LocationRequest(
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    Double lat,
    // ...
) {}
```

### ✅ 4. Inconsistent Error Handling (MEDIUM)

**Issue**: Different error formats exposed stack traces and internal details

**Fix Applied**:
- Created `GlobalExceptionHandler` with `@ControllerAdvice`
- Standardized error response format
- No stack traces in production responses
- Field-level validation errors

---

## Remaining Vulnerabilities

### 🔴 1. No Service-to-Service Authentication (CRITICAL)

**Issue**: Internal APIs like `/internal/graph/view` accept requests without authentication

**Current State**:
```java
// pins-service can call social-service with any viewerId/subjectId
String url = socialBaseUrl + "/internal/graph/view?viewerId=X&subjectId=Y";
// No authentication required!
```

**Risk**:
- Any service can impersonate any user
- Malicious service could enumerate relationships
- No audit trail of which service made which request

**Recommended Fix**:
1. **Option A**: Service-to-Service JWT
   ```java
   // Generate service token with service identity
   String serviceToken = generateServiceToken("pins-service");
   headers.setBearerAuth(serviceToken);

   // Verify service identity in social-service
   @PreAuthorize("hasRole('SERVICE_PINS')")
   public SocialGraphView getGraphView(...) { }
   ```

2. **Option B**: mTLS (Mutual TLS)
   - Each service has client certificate
   - Mutual authentication at TLS layer
   - More secure but more complex

3. **Option C**: API Keys with IP Whitelisting
   - Each service has unique API key
   - Validate key + source IP
   - Simple but less secure than JWT

**Priority**: Implement before production deployment

---

### 🔴 2. No Rate Limiting (CRITICAL)

**Issue**: No rate limits on any endpoints

**Attack Scenarios**:
- **Location Scraping**: Call `/pins/map` with different bboxes to map all pins
- **Relationship Enumeration**: Brute force friend relationships
- **DoS**: Overwhelm services with requests

**Recommended Fix**:

Using **Bucket4j** + **Redis**:

```xml
<dependency>
  <groupId>com.bucket4j</groupId>
  <artifactId>bucket4j-redis</artifactId>
</dependency>
```

```java
@Component
public class RateLimitFilter implements Filter {
  // Per-user limits
  private static final int USER_REQUESTS_PER_MINUTE = 60;

  // Per-IP limits (stricter)
  private static final int IP_REQUESTS_PER_MINUTE = 100;

  public void doFilter(ServletRequest request, ...) {
    String userId = extractUserId(request);
    String ipAddress = extractIp(request);

    // Check user rate limit
    if (!checkRateLimit(userId, USER_REQUESTS_PER_MINUTE)) {
      throw new RateLimitExceededException();
    }

    // Check IP rate limit
    if (!checkRateLimit(ipAddress, IP_REQUESTS_PER_MINUTE)) {
      throw new RateLimitExceededException();
    }

    chain.doFilter(request, response);
  }
}
```

**Priority**: High - Implement within 1 month

---

### 🟠 3. Tokens in localStorage (HIGH)

**Issue**: Frontend stores access tokens in `localStorage`, vulnerable to XSS

**Current Code**:
```typescript
// web/src/App.tsx
const [token, setToken] = useState<string | null>(() =>
  localStorage.getItem("brooks.token")
);
```

**Risk**: If XSS vulnerability exists, attacker can steal tokens

**Recommended Fix**:
1. **Access Tokens**: Keep in memory only (Redux, Zustand)
2. **Refresh Tokens**: Store in `httpOnly` cookie
3. **CSRF Protection**: Use SameSite cookies

```typescript
// Use Auth0 SDK's token management (already does this correctly)
const { getAccessTokenSilently } = useAuth0();

// Don't store in localStorage
const token = await getAccessTokenSilently();
```

**Priority**: Medium - Improve within 2 months

---

### 🟠 4. No Audit Logging (HIGH)

**Issue**: No logging of security events

**Missing Logs**:
- Failed authentication attempts
- Access control denials (pin access denied)
- Anomalous location patterns (teleportation)
- Relationship changes
- Admin actions

**Recommended Fix**:

```java
@Aspect
@Component
public class SecurityAuditAspect {
  private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");

  @AfterReturning(pointcut = "@annotation(Audited)")
  public void auditAccess(JoinPoint joinPoint) {
    String userId = SecurityContextUtil.currentUserId();
    String action = joinPoint.getSignature().getName();
    Object[] args = joinPoint.getArgs();

    auditLog.info("action={} user={} args={}", action, userId, args);
  }
}
```

**Priority**: High - Implement before production

---

### 🟡 5. No HTTPS Enforcement (MEDIUM)

**Issue**: Development uses HTTP, no HSTS headers

**Recommended Fix**:

```yaml
# application-prod.yml
server:
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD}
    key-store-type: PKCS12

# Add HSTS header
spring:
  security:
    headers:
      hsts:
        include-subdomains: true
        max-age: 31536000
```

**Priority**: Medium - Required for production

---

### 🟡 6. No SQL Injection Protection Audit (MEDIUM)

**Issue**: No systematic review of native queries

**Current State**: JPA queries appear safe, but need verification

**Action Required**:
```bash
# Search for potential SQL injection vectors
grep -r "nativeQuery = true" services/
grep -r "createNativeQuery" services/

# Review each native query for proper parameterization
```

**Example Safe Query**:
```java
@Query(value = "DELETE FROM pins WHERE id IN " +
    "(SELECT id FROM pins WHERE expires_at < :cutoffTime " +
    "ORDER BY expires_at LIMIT :limit)",
    nativeQuery = true)
int deleteExpiredPins(@Param("cutoffTime") Instant cutoffTime, @Param("limit") int limit);
```

**Priority**: Medium - Audit within 1 month

---

## Security Best Practices

### Secrets Management

**Current State**: Secrets in `.env` file (local development only)

**Production Recommendations**:

1. **AWS Secrets Manager**
   ```java
   @Configuration
   public class SecretsConfig {
     @Bean
     public DataSource dataSource() {
       String dbPassword = secretsManager.getSecretString("brooks/db/password");
       // ...
     }
   }
   ```

2. **HashiCorp Vault**
   ```yaml
   spring:
     cloud:
       vault:
         uri: https://vault.example.com
         token: ${VAULT_TOKEN}
         kv:
           enabled: true
           backend: secret
   ```

3. **Kubernetes Secrets** (for K8s deployments)
   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     name: brooks-secrets
   type: Opaque
   data:
     jwt-secret: <base64-encoded-secret>
   ```

### Secret Rotation

**Procedure**:
1. Generate new secret in secrets manager
2. Update service configuration to read both old and new
3. Restart services with new secret
4. Verify all services working
5. Remove old secret from configuration
6. Delete old secret from secrets manager

**Frequency**: Rotate secrets every 90 days minimum

---

## Authentication & Authorization

### Authentication Flow

```
1. User → Auth0 Login
2. Auth0 → Returns JWT (15 min TTL)
3. Frontend → Stores token in memory
4. Frontend → Includes "Bearer {token}" in all requests
5. Backend → Validates JWT with Auth0 public keys
6. Backend → Extracts user ID from "sub" claim
7. Backend → Processes request with user context
```

### JWT Validation

**Current Implementation**:
```java
@Configuration
public class SecurityConfig {
  @Bean
  public JwtDecoder jwtDecoder(
      @Value("${auth0.issuer-uri}") String issuer,
      @Value("${auth0.audience}") String audience
  ) {
    NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(issuer);
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
        JwtValidators.createDefaultWithIssuer(issuer),
        new AudienceValidator(audience)
    ));
    return decoder;
  }
}
```

**Validations Performed**:
- ✅ Signature verification (RSA256 with Auth0 public key)
- ✅ Issuer check (matches Auth0 tenant)
- ✅ Audience check (matches API identifier)
- ✅ Expiration check (exp claim)
- ✅ Not before check (nbf claim)

### Access Control Levels

1. **Endpoint-Level**: Spring Security (`@PreAuthorize`)
2. **Service-Level**: Business logic checks
3. **Data-Level**: PinAccessPolicy (11-factor)

---

## Input Validation

### Validation Strategy

**Defense Layers**:
1. **Client-Side**: Basic validation for UX (not security)
2. **API Gateway**: Rate limiting, schema validation (TODO)
3. **Service Layer**: Bean Validation (CURRENT)
4. **Database Layer**: Constraints (CHECK, NOT NULL)

### Current Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| text | `@NotBlank`, `@Size(1-500)` | Required, max 500 chars |
| linkUrl | `@Size(max=2048)` | Max 2048 chars |
| lat | `@DecimalMin(-90)`, `@DecimalMax(90)` | Must be valid latitude |
| lng | `@DecimalMin(-180)`, `@DecimalMax(180)` | Must be valid longitude |
| expiresAt | `@Future` | Must be in future |
| revealRadiusM | `@Min(1)` | Must be positive |

### Sanitization

**Current**: No HTML sanitization (accept plain text only)

**If HTML Support Added**:
```java
<dependency>
  <groupId>org.owasp.encoder</groupId>
  <artifactId>encoder</artifactId>
</dependency>

String sanitized = Encode.forHtml(userInput);
```

---

## Rate Limiting

### Recommended Limits

| Endpoint | Per User | Per IP | Window |
|----------|----------|--------|--------|
| `/pins` (create) | 10 | 20 | 1 hour |
| `/pins/map` | 60 | 100 | 1 minute |
| `/pins/candidates` | 30 | 50 | 1 minute |
| `/pins/{id}/check-reveal` | 100 | 200 | 1 hour |
| `/follow/*` | 20 | 40 | 1 hour |

### Anomaly Detection

**Teleportation Detection**:
```java
// Detect impossible location changes
if (distanceMeters > 1000 && timeDiffSeconds < 60) {
  log.warn("Possible location spoofing: userId={}, distance={}m in {}s",
      userId, distanceMeters, timeDiffSeconds);
  // Flag for review or rate limit
}
```

---

## Monitoring & Alerts

### Security Metrics

**Must Monitor**:
1. **Authentication Failures** (> 10 per minute)
2. **Authorization Denials** (> 50 per minute)
3. **Circuit Breaker Opens** (any occurrence)
4. **Rate Limit Hits** (> 100 per minute)
5. **Database Connection Errors** (> 5 per minute)
6. **Unusual Location Patterns** (custom detection)

### Alert Configuration

```yaml
# Prometheus Alert Rules
groups:
  - name: security_alerts
    rules:
      - alert: HighAuthFailureRate
        expr: rate(auth_failures_total[5m]) > 10
        annotations:
          summary: "High authentication failure rate"

      - alert: CircuitBreakerOpen
        expr: resilience4j_circuitbreaker_state{state="open"} == 1
        annotations:
          summary: "Circuit breaker opened for {{ $labels.name }}"
```

---

## Incident Response

### Security Incident Procedure

1. **Detect**: Monitoring alert triggers
2. **Assess**: Determine severity and scope
3. **Contain**: Block malicious IPs, revoke tokens
4. **Eradicate**: Fix vulnerability
5. **Recover**: Restore normal operations
6. **Review**: Post-mortem and improvements

### Emergency Contacts

- **Security Lead**: TBD
- **On-Call Engineer**: Check PagerDuty
- **Auth0 Support**: support@auth0.com

### Incident Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| P0 | Data breach | Immediate | User data exposed |
| P1 | Active attack | < 15 min | DoS, brute force |
| P2 | Vulnerability found | < 4 hours | SQL injection discovered |
| P3 | Security improvement | < 1 week | Missing header |

---

## Checklist: Production Security

Before deploying to production, ensure:

### Critical (Must Fix)
- [ ] Remove `.env` from git history
- [ ] Rotate all Auth0 secrets
- [ ] Generate strong DB passwords
- [ ] Implement service-to-service auth
- [ ] Add rate limiting
- [ ] Enable HTTPS with HSTS
- [ ] Set up secrets manager (AWS/Vault)
- [ ] Configure audit logging
- [ ] Add security monitoring/alerts

### High Priority (Should Fix)
- [ ] Move tokens from localStorage to memory
- [ ] Add CSRF protection
- [ ] Implement anomaly detection
- [ ] Audit all native SQL queries
- [ ] Add IP whitelisting for internal APIs
- [ ] Configure CORS properly
- [ ] Add security headers (CSP, X-Frame-Options)

### Medium Priority (Nice to Have)
- [ ] Add WAF (Web Application Firewall)
- [ ] Implement honeypot endpoints
- [ ] Add database encryption at rest
- [ ] Set up penetration testing
- [ ] Create security incident runbook

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Auth0 Security Best Practices](https://auth0.com/docs/secure)
- [Spring Security Documentation](https://docs.spring.io/spring-security/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Document Version**: 1.0
**Last Review**: 2026-01-10
**Next Review**: 2026-04-10 (quarterly)
