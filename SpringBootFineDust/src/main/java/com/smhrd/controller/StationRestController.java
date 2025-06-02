package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.entity.Station;
import com.smhrd.service.StationService;

@RestController
public class StationRestController {

    @Autowired
    private StationService stService;
	
	
    @PostMapping("/updateStationInfo")
    public String mypage(@RequestBody Station st) {
    	stService.setStInfo(st);
        return "success";
    }
    
    @GetMapping("/getStationInfo")
    public Station getStationInfo(@RequestParam String usrEmail) {
    	Station st = stService.getStInfo(usrEmail);
    	return st;
    }

}
