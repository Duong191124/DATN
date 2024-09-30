package com.example.demo.component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Locale;

@Component
public class LocaleInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String lang = request.getHeader("Accept-Language");
        Locale locale = (lang != null) ? Locale.forLanguageTag(lang) : Locale.ENGLISH;
        LocaleContextHolder.setLocale(locale);
        return true;
    }
}
