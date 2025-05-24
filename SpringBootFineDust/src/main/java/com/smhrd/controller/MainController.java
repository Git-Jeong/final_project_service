package com.smhrd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    
	@RequestMapping("/")
	public String mainFisrtPage() {
		return "redirect:/main";
	}
	
	@RequestMapping("/main")
	public String mainPage() {
		return "main";
	}
}