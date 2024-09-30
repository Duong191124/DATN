package com.example.demo.config;

import com.example.demo.component.LocaleInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;


@Configuration
public class LanguageConfig implements WebMvcConfigurer {

    @Autowired
    private LocaleInterceptor localeInterceptor;

    @Bean // Tạo default file ngôn ngữ được chọn
    public LocaleResolver localeResolver(){
        SessionLocaleResolver resolver = new SessionLocaleResolver();
        resolver.setDefaultLocale(new Locale("vi"));
        return resolver;
    }

    @Override //set mehtod changeInterceptor vào config
    public void addInterceptors(InterceptorRegistry registry){
        registry.addInterceptor(localeInterceptor);
    }


    @Bean // Khai báo file ngôn ngữ được lấy ở đâu, cấu trúc như nào
    public MessageSource messageSource(){
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }

}
