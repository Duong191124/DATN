package com.example.demo.utils;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        // Lấy các quyền từ claim huudungdz.authorities
        Map<String, Object> claims = jwt.getClaims();
        Map<String, Object> huudungdz = (Map<String, Object>) claims.get("huudungdz");

        // Lấy danh sách authorities từ huudungdz
        List<Map<String, Object>> authorities = (List<Map<String, Object>>) huudungdz.get("authorities");

        // Chuyển đổi danh sách authorities thành danh sách GrantedAuthority
        return authorities.stream()
                .map(authority -> (Map<String, Object>) authority.get("arg$1")) // Lấy đối tượng quyền
                .filter(arg -> arg != null && arg.get("name") != null) // Kiểm tra null trước khi lấy quyền
                .map(arg -> new SimpleGrantedAuthority((String) arg.get("name"))) // Lấy tên quyền
                .collect(Collectors.toList());
    }
}
