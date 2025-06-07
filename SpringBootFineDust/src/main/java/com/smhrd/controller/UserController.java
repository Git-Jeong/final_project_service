package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.smhrd.config.EncryptionUtil;
import com.smhrd.config.JwtUtil;
import com.smhrd.config.TokenCheck;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private TokenCheck token;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EncryptionUtil EncryptionUtil;

    @Value("${jwt.secret.val.2}")
    private String secretVal_2;

    @Value("${jwt.cookie.name}")
    private String token_login;

    @GetMapping("/signup")
    public String join(HttpServletRequest request) {
        if (token.isUserLoggedIn(request)) {
            return "redirect:/service";
        }
        return "user/signup";
    }

    @GetMapping("/login")
    public String login(HttpServletRequest request) {
        if (token.isUserLoggedIn(request)) {
            return "redirect:/service";
        }
        return "user/login";
    }

    @PostMapping("/login")
    public String login(User vo, HttpServletResponse response) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		User dbUser = service.findByUsrEmailForLogin(vo.getUsrEmail());
    		
    		if (dbUser == null) {
	            return "redirect:/login";  // 사용자 없음
	        }
    		
    		// 2. 비밀번호 검증
            boolean matches = EncryptionUtil.verifyPassword(vo.getUsrPw(), dbUser.getUsrPw());
            if (!matches) {
                return "redirect:/login";  // 비밀번호 불일치
            }
            
            // 3. 인증 성공 시 로그인 처리
            String jwt = jwtUtil.generateToken(dbUser);
            Cookie cookie = new Cookie(token_login, jwt);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 8);
            response.addCookie(cookie);
            return "redirect:/service";
    	} 
        else {
            return "redirect:/login";
        }
    }

    @GetMapping("/update")
    public String update(HttpServletRequest request, Model model) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        String userEmail = token.extractUserFromJwt(request);
        model.addAttribute("userEmail", userEmail);
        return "user/update";
    }

    @GetMapping("/resetpw")
    public String resetpw(HttpServletRequest request) {
        if (token.isUserLoggedIn(request)) {
            return "redirect:/service";
        }
        return "user/resetpw";
    }
    
    @PostMapping("/resetpw")
    public String resetPassword(User vo) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		String aesPw = EncryptionUtil.encrypt(vo.getUsrPw());
    		if(aesPw == null) {
                return "redirect:/resetpw";
    		}
			vo.setUsrPw(aesPw);
    	}
		
    	boolean result = service.resetPassword(vo);
    	if (result == true) {
            return "redirect:/login";
    	}
    	else {
        	return null;
    	}
    }
    
}
