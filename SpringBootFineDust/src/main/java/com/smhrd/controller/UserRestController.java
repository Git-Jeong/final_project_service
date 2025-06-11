package com.smhrd.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.config.EncryptionUtil;
import com.smhrd.config.JwtUtil;
import com.smhrd.config.TokenCheck;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class UserRestController {

	@Autowired
	private UserService userService;
	
    @Autowired
    private EncryptionUtil EncryptionUtil;
    
    @Autowired
    private TokenCheck token;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Value("${jwt.cookie.name}")
    private String token_login;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User vo, HttpServletResponse response) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		User dbUser = userService.findByUsrEmailForLogin(vo.getUsrEmail());
    		
    		if (dbUser == null) {
    			return ResponseEntity.ok(Map.of("status", "fail", "message", "회원이 아니거나, 비밀번호가 잘못되었습니다."));
	        }
    		
    		// 2. 비밀번호 검증
            boolean matches = EncryptionUtil.verifyPassword(vo.getUsrPw(), dbUser.getUsrPw());
            if (!matches) {
            	return ResponseEntity.ok(Map.of("status", "fail", "message", "회원이 아니거나, 비밀번호가 잘못되었습니다."));
            }
            
            // 3. 인증 성공 시 로그인 처리
            String jwt = jwtUtil.generateToken(dbUser);
            Cookie cookie = new Cookie(token_login, jwt);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 8);
            response.addCookie(cookie);
            return ResponseEntity.ok(Map.of("status", "success", "message", "로그인 성공"));
    	} 
        else {
            return ResponseEntity.ok(Map.of("status", "fail", "message", "잘못된 요청입니다."));
        }
    }
    
    @PostMapping("/signup")
    public String join(@RequestBody User vo) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		String aesPw = EncryptionUtil.encrypt(vo.getUsrPw());
    		if(aesPw == null) {
                return "redirect:/update";
    		}
			vo.setUsrPw(aesPw);
    	}
    	userService.join(vo);
        return "success";
    }
    
    @GetMapping("/getUserInfo")
    public User getStationInfo(@RequestParam String usrEmail) {
    	User m = new User();
        m.setUsrEmail(usrEmail);
        User vo = userService.getUserInfo(m);
    	return vo;
    }
    
    @PostMapping("/updateUserInfo")
    public String updateUserInfo(@RequestBody User vo, HttpServletRequest request) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		String aesPw = EncryptionUtil.encrypt(vo.getUsrPw());
    		String userEmail = token.extractUserFromJwt(request);
    		if((aesPw == null) || (userEmail == null)) {
    	        return "err";
    		}
    		vo.setUsrEmail(userEmail);
    		//만약을 대비하여 유저 닉네임은 다시 처리
			vo.setUsrPw(aesPw);
    	}
    	userService.setUserInfo(vo);
        return "success";
    }
    
    @PostMapping("/deleteAollNotification")
    public String deleteAollNotification(HttpServletRequest request) {
    	
    }

    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(token_login, null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "success";
    }
}
