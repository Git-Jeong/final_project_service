package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import com.smhrd.config.EncryptionUtil;
import com.smhrd.config.TokenCheck;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private TokenCheck token;

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
