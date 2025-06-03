package com.smhrd.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.smhrd.entity.User;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

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
		long currentMillis = System.currentTimeMillis();
		long uuidNum = Math.abs(UUID.randomUUID().getMostSignificantBits());
		int randomNum = new Random().nextInt(10000) + 1;  // 1~10000 난수

		long combinedVal = currentMillis * uuidNum * randomNum;

		return Jwts.builder()
		        .setSubject(vo.getUsrEmail())
		        .claim(secretVal_1, combinedVal)
		        .claim(secretVal_2, vo.getUsrEmail())
		        .claim(secretVal_3, UUID.randomUUID().toString())
		        .setIssuedAt(new Date())
		        .setExpiration(new Date(currentMillis + 8 * 60 * 60 * 1000))
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
