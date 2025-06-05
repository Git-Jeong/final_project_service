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
    	stId = 1; //현재는 모든 데이터가 1번으로 저장되어 있어서 이걸로 처리
    	System.out.println("역; 수신 됨");
    	ArrayList<Sensor> snsr = (ArrayList<Sensor>) snsrService.getStDust(stId);
    	System.out.println("불러온 데이터?? : " + snsr);
    	return snsr;
    }

}
