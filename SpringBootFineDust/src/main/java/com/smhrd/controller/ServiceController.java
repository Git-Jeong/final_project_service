package com.smhrd.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import com.smhrd.config.TokenCheck;
import com.smhrd.entity.Station;
import com.smhrd.service.StationService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ServiceController {

    @Autowired
    private TokenCheck token;
    
    @Autowired
    private StationService stService;
    
	@GetMapping("/service")
	public String mainFisrtPage(HttpServletRequest request, Model model) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }

        String usrEmail = token.extractUserFromJwt(request);
        String userName = token.getNameFromJwt(request);
        
//        System.out.println("userName = " + userName);
        
        ArrayList<Station> stationList = (ArrayList<Station>) stService.getStInfo(usrEmail);

        //model.addAttribute("usrEmail", usrEmail);
        model.addAttribute("userName", userName);
        model.addAttribute("stationList", stationList);
		return "service/serviceMain";
	}
	 
	@GetMapping("/serviceHistory")
	public String serviceHistoryPage(HttpServletRequest request, Model model) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        String usrEmail = token.extractUserFromJwt(request);
        String userName = token.getNameFromJwt(request);

        ArrayList<Station> stationList = (ArrayList<Station>) stService.getStInfo(usrEmail);

        //model.addAttribute("usrEmail", usrEmail);
        model.addAttribute("userName", userName);
        model.addAttribute("stationList", stationList);
		return "service/serviceHistory";
	}

    // 테스트용 페이지
    @GetMapping("/serviceTest")
    public String serviceTest(HttpServletRequest request, Model model) {
        if (!token.isUserLoggedIn(request)) {
            return "redirect:/main";
        }
        String usrEmail = token.extractUserFromJwt(request);
        String userName = token.getNameFromJwt(request);

        ArrayList<Station> stationList = (ArrayList<Station>) stService.getStInfo(usrEmail);

        //model.addAttribute("usrEmail", usrEmail);
        model.addAttribute("userName", userName);
        model.addAttribute("stationList", stationList);
		return "service/serviceTest";
    }
}


