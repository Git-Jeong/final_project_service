package com.smhrd.controller;

import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.entity.Sensor;
import com.smhrd.service.SensorService;

@RestController
public class ServiceRestController {

    @Autowired
    private SensorService snsrService;
    
    @GetMapping("/getStationDust")
    public ArrayList<Sensor> getStationInfo(@RequestParam int stId) {
    	stId = 1; //현재는 모든 데이터가 1번으로 저장되어 있어서 이걸로 처리'
    	ArrayList<Sensor> snsr = (ArrayList<Sensor>) snsrService.getStDust(stId);
    	
    	System.out.println("시간\t\t\tPM1\t\tPM2.5\tPM10");
    	for (int i = 0; i < snsr.size(); i++) {
    		System.out.println(snsr.get(i).getTimeHms() + "\t\t" + snsr.get(i).getPm1() + "\t\t" + snsr.get(i).getPm25() + "\t\t" + snsr.get(i).getPm10());
    	}
    	
    	return snsr;
    }

}
