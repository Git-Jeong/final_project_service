package com.smhrd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ServiceController {
    
	@GetMapping("/service")
	public String mainFisrtPage() {
		return "service/service";
	}
}