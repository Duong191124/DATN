package com.example.demo.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary(){
        Map<String, String> map = new HashMap<>();
        map.put("cloud_name", "df0cjvbz8");
        map.put("api_key", "859935455757821");
        map.put("api_secret", "GUjfxE2DCoTP-yZAK5SUiUW0qcE");
        return new Cloudinary(map);
    }

}
