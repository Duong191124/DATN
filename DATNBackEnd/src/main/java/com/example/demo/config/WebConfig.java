package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .authorizeHttpRequests(author -> author
                        .requestMatchers("/api/v1/products/upload/**").permitAll()
                        .requestMatchers("/api/v1/products/**").permitAll()
                        .anyRequest().permitAll()
                )
                .csrf(c -> c.disable())
                .formLogin(f -> f.disable());
        return http.build();
    }

}
