package com.smhrd.controller;

import java.util.List;

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
    public List<Station> getStationInfo(@RequestParam String usrEmail) {
    	List<Station> st = stService.getStInfo(usrEmail);
    	return st;
    }

    @PostMapping("/insertSt")
    public String insertSt(@RequestBody Station st) {
    	boolean result = stService.insertSt(st);
    	if(result) {
            return "success";
    	}
    	else {
            return "fail..";
    	}
    }
}
