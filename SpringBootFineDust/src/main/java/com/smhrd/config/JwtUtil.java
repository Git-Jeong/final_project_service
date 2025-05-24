package com.smhrd.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.smhrd.entity.User;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;
    
    @Value("${jwt.secret.val.1}")
    private String secretVal_1;

    @Value("${jwt.secret.val.2}")
    private String secretVal_2;

    @Value("${jwt.secret.val.3}")
    private String secretVal_3;
    
    public String generateToken(User vo) {
        return Jwts.builder()
                .setSubject(vo.getUsrEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) //1시간
                .claim(secretVal_1, System.currentTimeMillis())
                .claim(secretVal_2, vo.getUsrEmail())
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();
    }

 // JwtUtil 클래스에 Claims 반환 메서드 추가
    public Claims validateTokenAndGetClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey.getBytes())
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }

}
