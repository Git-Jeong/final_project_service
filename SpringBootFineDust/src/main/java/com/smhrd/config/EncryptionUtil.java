package com.smhrd.config;

import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class EncryptionUtil {

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // 비밀번호 해시 생성
    public String encrypt(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
    
    // 비밀번호 검증
    public boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
