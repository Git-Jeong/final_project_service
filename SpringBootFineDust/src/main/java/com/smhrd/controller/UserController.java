package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.smhrd.config.JwtUtil;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class UserController {

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
    
    @Value("${service.admin.id}")
    private String admin_id;
    
	@GetMapping("/signup")
	public String join(HttpServletRequest request) {
	    if (validateJwtFromCookie(request)) {
	        return "redirect:/main";
	    }
		return "member/signup";
	}
	
	@PostMapping("/signup")
	public String join(User vo) {
		service.join(vo);
		return "redirect:/login";
	}
	
	@GetMapping("/login")
	public String login(HttpServletRequest request) {
	    if (validateJwtFromCookie(request)) {
	        return "redirect:/main";
	    }
		return "member/login";
	}

	@PostMapping("/login")
	public String login(User vo, HttpServletResponse response) {
	    User m = service.login(vo);

	    if (m != null) {
	        String jwt = jwtUtil.generateToken(vo);
	        Cookie cookie = new Cookie(token_login, jwt);
	        cookie.setHttpOnly(true);
	        cookie.setPath("/");
	        cookie.setMaxAge(60 * 60);
	        response.addCookie(cookie);
	    }
	    return "redirect:/service";
	}
	
	@GetMapping("/update")
	public String update(HttpServletRequest request, Model model) {
	    if (!validateJwtFromCookie(request)) {
	        return "redirect:/main";
	    }
	    User m = getIdFromJwtCookie(request);
	    User vo = service.getMemberInfo(m);
	    model.addAttribute("vo", vo);
		return "member/update";
	}
	
	@PostMapping("/update")
	public String update(HttpServletRequest request, User vo) {
	    if (!validateJwtFromCookie(request)) {
	        return "redirect:/main";
	    }
	    service.setMemberInfo(vo);
		return "redirect:/main";
	}
	
	@GetMapping("/logout")
	public String logout(HttpServletResponse response) {
	    Cookie cookie = new Cookie(token_login, null);
	    cookie.setMaxAge(0);
	    cookie.setPath("/");
	    response.addCookie(cookie);
		return "redirect:/main";
	}

	
	private boolean validateJwtFromCookie(HttpServletRequest request) {
	    Cookie[] cookies = request.getCookies();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if (token_login.equals(cookie.getName())) {
	                String token = cookie.getValue();
	                Claims claims = jwtUtil.validateTokenAndGetClaims(token);
	                if (claims != null) {
	                    String email = (String) claims.get(secretVal_2); 
	                    // 서비스에 실제 존재하는 계정인지 확인
	                    User m = new User();
	                    m.setUsr_email(email);
	                    if (service.tokenCheck(m)) {
	                        return true;
	                    }
	                }
	            }
	        }
	    }
	    return false;
	}
	
	private User getIdFromJwtCookie(HttpServletRequest request) {
	    Cookie[] cookies = request.getCookies();
        User m = new User();
	    if (cookies != null) {
	        for (Cookie cookie : cookies) {
	            if (token_login.equals(cookie.getName())) {
	                String token = cookie.getValue();
	                Claims claims = jwtUtil.validateTokenAndGetClaims(token);
	                if (claims != null) {
	                    String email = (String) claims.get(secretVal_2);
	                    m.setUsr_email(email);
	                }
	            }
	        }
	    }
        return m;
	}

	
}
