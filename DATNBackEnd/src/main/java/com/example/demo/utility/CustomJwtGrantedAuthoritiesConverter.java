//package com.example.demo.utility;
//
//import org.springframework.core.convert.converter.Converter;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.oauth2.jwt.Jwt;
//
//import java.util.Collection;
//import java.util.List;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
//
//    @Override
//    public Collection<GrantedAuthority> convert(Jwt jwt) {
//        // Lấy các quyền từ claim claim.authorities
//        Map<String, Object> claims = jwt.getClaims();
//        Map<String, Object> claim = (Map<String, Object>) claims.get("claim");
//        List<Map<String, String>> authorities = (List<Map<String, String>>) claim.get("authorities");
//
//        return authorities.stream()
//                .map(authority -> new SimpleGrantedAuthority(authority.get("role")))
//                .collect(Collectors.toList());
//    }
//}