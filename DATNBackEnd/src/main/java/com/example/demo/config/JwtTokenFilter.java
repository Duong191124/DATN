package com.example.demo.config;

import com.example.demo.entity.Staff;
import com.example.demo.exception.JwtOldVersion;
import com.example.demo.repository.StaffRepo;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Value("${huudung.secret.key}")  // Lấy secret key từ application.properties
    private String secretKey;
    @Autowired
    StaffRepo staffRepo;
    @Override
    protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, HttpServletResponse response, jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, IOException {
        String token = getJwtFromRequest(request);

        if (token != null) {
            try {
                Claims claims = extractClaims(token);
                String identifier = claims.get("identifier", String.class);
                String sub = claims.get("sub", String.class);
                Staff currentStaff = staffRepo.findByUsername(sub);
                if (currentStaff != null) {
                    if (!currentStaff.getIdentifierToken().equals(identifier)) {
                        // Trả response lỗi luôn tại đây
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write(
                                "{\"message\": \"Token not match\", \"status\": 401, \"data\": null}"
                        );
                        return;
                    }
                }
            } catch (Exception e) {
                // Trả response lỗi nếu có lỗi trong xử lý token
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.setContentType("application/json");
                response.getWriter().write(
                        "{\"message\": \"Please don't fake token LOL\", \"status\": 401, \"data\": null}"
                );
                return; // Kết thúc luồng xử lý
            }
        }

        filterChain.doFilter(request, response); // Tiếp tục xử lý nếu không có lỗi
    }


    private String getJwtFromRequest(jakarta.servlet.http.HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
