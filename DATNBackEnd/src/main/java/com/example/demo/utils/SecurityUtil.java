package com.example.demo.utils;

import com.example.demo.entity.Staff;
import com.example.demo.repository.StaffRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
@Service
public class SecurityUtil {
    @Value("${huudung.secret.key}")
    private String secretKey;

    @Value("${huudung.duration.date}")
    private Long duration;

    @Autowired
    JwtEncoder jwtEncoder;

    @Autowired
    StaffRepo staffRepo;

    // khai báo thuật toán để hashcode secret key
    public final MacAlgorithm macAlgorithm = MacAlgorithm.HS512;

    public String createToken(Authentication authentication) {
        // Build header
        JwsHeader jwsHeader = JwsHeader.with(macAlgorithm).build();

        // Build payload
        Instant now = Instant.now(); // current time
        Instant validity = now.plus(this.duration, ChronoUnit.SECONDS); // expiration time
        String username = authentication.getName();

        // Build identifier random code to kill old token
        Staff staff = staffRepo.findByUsername(username);

        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuedAt(now) // time start
                .expiresAt(validity) // time end
                .subject(authentication.getName()) // subject (typically username)
                .claim("huudungdz", authentication); // additional claim with authentication object

        // Conditionally add extra claims
        if (staff != null) {
            String newIdentifier = UUID.randomUUID().toString();
            staff.setIdentifierToken(newIdentifier);
            staffRepo.save(staff);
            claimsBuilder.claim("identifier", newIdentifier);
        }

        // Build the final JwtClaimsSet
        JwtClaimsSet jwtClaimsSet = claimsBuilder.build();

        // Return the token and build signature from header and payload
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, jwtClaimsSet)).getTokenValue();
    }
}
