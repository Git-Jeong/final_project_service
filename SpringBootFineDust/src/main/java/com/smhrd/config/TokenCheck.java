package com.smhrd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;

import com.smhrd.entity.User;
import com.smhrd.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class TokenCheck {

    @Autowired
    private UserService service;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${jwt.secret.val.2}")
    private String secretVal_2;
    
    @Value("${jwt.secret.val.3}")
    private String secretVal_3;

    @Value("${jwt.cookie.name}")
    private String token_login;

    public boolean isUserLoggedIn(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (token_login.equals(cookie.getName())) {
                    String token = cookie.getValue();
                    Claims claims = jwtUtil.validateTokenAndGetClaims(token);
                    if (claims != null) {
                        String email = claims.get(secretVal_2, String.class);
                        User m = new User();
                        m.setUsrEmail(email);
                        return service.tokenCheck(m);
                    }
                }
            }
        }
        return false;
    }

    public String extractUserFromJwt(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String email = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (token_login.equals(cookie.getName())) {
                    String token = cookie.getValue();
                    Claims claims = jwtUtil.validateTokenAndGetClaims(token);
                    if (claims != null) {
                        email = claims.get(secretVal_2, String.class);
                    }
                }
            }
        }
        return email;
    }
    
    public String getNameFromJwt(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String userName = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (token_login.equals(cookie.getName())) {
                    String token = cookie.getValue();
                    Claims claims = jwtUtil.validateTokenAndGetClaims(token);
                    if (claims != null) {
                    	userName = claims.get(secretVal_3, String.class);
                    }
                }
            }
        }
        return userName;
    }
}
