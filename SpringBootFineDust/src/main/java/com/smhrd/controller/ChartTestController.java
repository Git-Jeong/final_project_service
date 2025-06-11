package com.smhrd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class ChartTestController {
	
	    @RequestMapping("/chartTest")
	    public String showChart() {
	        return "chartTest"; // 차트가 잘작동하는지 테스트한겁니다. 맘껏 지우셔도 됩니다 감사합니다.
	    
}
	    
	   
}
