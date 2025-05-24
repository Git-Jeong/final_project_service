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
        User m = service.login(vo);
        if (m != null) {
            String jwt = jwtUtil.generateToken(vo);
            Cookie cookie = new Cookie(token_login, jwt);
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(3600); // 1시간
            response.addCookie(cookie);
            return "redirect:/service";
        }
        else {
        	return "user/login";

        }
    }

    @GetMapping("/update")
    public String update(HttpServletRequest request, Model model) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        User m = token.extractUserFromJwt(request);
        User vo = service.getUserInfo(m);
        model.addAttribute("vo", vo);
        return "user/update";
    }

    @PostMapping("/update")
    public String update(HttpServletRequest request, User vo) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        service.setUserInfo(vo);
        return "redirect:/update";
    }

    @GetMapping("/logout")
    public String logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(token_login, null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "redirect:/main";
    }
}
