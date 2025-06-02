package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.smhrd.config.TokenCheck;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ServiceController {

    @Autowired
    private TokenCheck token;
    
	@GetMapping("/service")
	public String mainFisrtPage(HttpServletRequest request, Model model) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }

        String getName = token.extractUserFromJwt(request);
        String userName = getName.substring(0, getName.indexOf('@'));

        model.addAttribute("userName", userName);
		return "service/serviceMain";
	}
}