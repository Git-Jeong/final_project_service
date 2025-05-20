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

    @Value("${jwt.cookie.name}")
    private String token_login;

    @GetMapping("/signup")
    public String join(HttpServletRequest request) {
        if (isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        return "user/signup";
    }

    @PostMapping("/signup")
    public String join(User vo) {
        service.join(vo);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String login(HttpServletRequest request) {
        if (isUserLoggedIn(request)) {
            return "redirect:/main";
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
        }
        return "redirect:/service";
    }

    @GetMapping("/update")
    public String update(HttpServletRequest request, Model model) {
        if (!isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        User m = extractUserFromJwt(request);
        User vo = service.getUserInfo(m);
        model.addAttribute("vo", vo);
        return "user/update";
    }

    @PostMapping("/update")
    public String update(HttpServletRequest request, User vo) {
        if (!isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        service.setUserInfo(vo);
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

    private boolean isUserLoggedIn(HttpServletRequest request) {
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

    private User extractUserFromJwt(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        User m = new User();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (token_login.equals(cookie.getName())) {
                    String token = cookie.getValue();
                    Claims claims = jwtUtil.validateTokenAndGetClaims(token);
                    if (claims != null) {
                        String email = claims.get(secretVal_2, String.class);
                        m.setUsrEmail(email);
                    }
                }
            }
        }
        return m;
    }
}
