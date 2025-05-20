package com.smhrd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {
    
	@RequestMapping("/")
	public String mainFisrtPage() {
		return "redirect:/mainPage";
	}
	
	@RequestMapping("/mainPage")
	public String mainPage() {
		return "MainPage";
	}
}