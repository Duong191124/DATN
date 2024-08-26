package com.example.demo.utility;
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

@Service
public class SecurityUtil {
    @Value("${huudung.secret.key}")
    private String secretKey;

    @Value("${huudung.duration.date}")
    private Long duration;

    @Autowired
    JwtEncoder jwtEncoder;

    //khai báo thuật toán để hashcode secret key
    public final MacAlgorithm macAlgorithm = MacAlgorithm.HS512;

    public String createToken(Authentication authentication){
        //build header
        JwsHeader jwsHeader = JwsHeader.with(macAlgorithm).build();

        //build payload
        //set time out of date
        Instant now = Instant.now(); //current time
        Instant validity = now.plus(this.duration, ChronoUnit.SECONDS); //dead time

        JwtClaimsSet jwtClaimsSet = JwtClaimsSet.builder()
                .issuedAt(now) //time start
                .expiresAt(validity)//time end
                .subject(authentication.getName())
                .claim("huudungdz", authentication)
                .build();

        //return to token and build signature from header and payload
        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, jwtClaimsSet)).getTokenValue();
    }
}
