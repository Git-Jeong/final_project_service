package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.smhrd.config.TokenCheck;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ServiceController {

    @Autowired
    private TokenCheck token;
    
	@GetMapping("/service")
	public String mainFisrtPage(HttpServletRequest request) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }
		return "service/serviceMain";
	}
}