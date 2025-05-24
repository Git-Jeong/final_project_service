package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import com.smhrd.entity.Station;
import com.smhrd.service.StationService;

@Controller
public class StationController {

    @Autowired
    private StationService service;

    @PostMapping("/InsertSt")
    public String insertSt(Station st) {
    	boolean result = service.insertSt(st);
    	if(result) {
    		return "redirect:/Login";
    	}
    	else {
    		return "redirect:/Signup";
    	}
    }
    
}
