package com.example.demo.utils;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CustomJwtGrantedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        // Lấy các claims từ JWT
        Map<String, Object> claims = jwt.getClaims();

        // Kiểm tra xem claim "huudungdz" có tồn tại hay không
        Map<String, Object> huudungdz = (Map<String, Object>) claims.get("huudungdz");
        if (huudungdz == null) {
            // Nếu không tồn tại, trả về một danh sách quyền rỗng
            return Collections.emptyList();
        }

        // Kiểm tra xem danh sách authorities có tồn tại không
        List<Map<String, Object>> authorities = (List<Map<String, Object>>) huudungdz.get("authorities");
        if (authorities == null) {
            // Nếu không có danh sách quyền, trả về danh sách quyền rỗng
            return Collections.emptyList();
        }

        // Chuyển đổi danh sách authorities thành danh sách GrantedAuthority
        return authorities.stream()
                .map(authority -> (Map<String, Object>) authority.get("arg$1")) // Lấy đối tượng quyền
                .filter(arg -> arg != null && arg.get("name") != null) // Kiểm tra arg và name không null
                .map(arg -> new SimpleGrantedAuthority((String) arg.get("name"))) // Lấy tên quyền
                .collect(Collectors.toList());
    }
}
