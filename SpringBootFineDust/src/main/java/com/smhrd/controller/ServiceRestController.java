package com.smhrd.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.config.TokenCheck;
import com.smhrd.entity.Notification;
import com.smhrd.entity.Sensor;
import com.smhrd.service.NotificationService;
import com.smhrd.service.SensorService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ServiceRestController {

    @Autowired
    private SensorService snsrService;

	@Autowired
	private NotificationService notifyService;

    @Autowired
    private TokenCheck token;
    
    @GetMapping("/getStationDust")
    public ArrayList<Sensor> getStationInfo(@RequestParam int stId, HttpServletRequest request) {
    	int originStId = stId;
    	stId = 1; //현재는 모든 데이터가 1번으로 저장되어 있어서 이걸로 처리'

    	String usrEmail = token.extractUserFromJwt(request);
    	if(usrEmail == null) {
    		return null;
    	}
    	
    	ArrayList<Sensor> snsr = (ArrayList<Sensor>) snsrService.getStDust(stId);

    	// 더미데이터를 불러 왔으니, 다시 stId값을 복구
    	stId = originStId;
    	//알림기능 테스트룰 위한 더미 센싱값
//    	snsr.get(0).setPm1(21);
//    	snsr.get(0).setPm25(21);
//    	snsr.get(0).setPm10(21);

    	if((snsr != null) && (snsr.get(0) != null) && (snsr.get(0).getPm1() != null)) {
    		if(snsr.get(0).getPm1() >= 20) {
    			//초미세먼지 경고 알림 보내기
    			notifyService.sendPm1Notify(stId, usrEmail, snsr.get(0).getPm1());
    		}
    	}    	
    	
    	if((snsr != null) && (snsr.get(0) != null) && (snsr.get(0).getPm25() != null)) {
    		if(snsr.get(0).getPm25() >= 20) {
    			//초미세먼지 경고 알림 보내기
    			notifyService.sendPm25Notify(stId, usrEmail, snsr.get(0).getPm25());
    		}
    	}
    	
    	if((snsr != null) && (snsr.get(0) != null) && (snsr.get(0).getPm10() != null)) {
    		if(snsr.get(0).getPm10() >= 20) {
    			//미세먼지 경고 알림 보내기
    			notifyService.sendPm10Notify(stId, usrEmail, snsr.get(0).getPm10());
    		}
    	}
    	return snsr;
    }

    @GetMapping("/getAllNotify")
    public List<Notification> getAllNotify(HttpServletRequest request) {
    	String usrEmail = token.extractUserFromJwt(request);
    	if(usrEmail == null) {
    		return null;
    	} 
    	List<Notification> getAllList =  notifyService.getAllNotify(usrEmail); 
    	return getAllList;
    }
}
