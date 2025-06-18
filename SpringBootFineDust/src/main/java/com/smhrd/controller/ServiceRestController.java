package com.smhrd.controller;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.config.TokenCheck;
import com.smhrd.entity.Notification;
import com.smhrd.entity.Pred;
import com.smhrd.entity.Sensor;
import com.smhrd.entity.SensorPredResponse;
import com.smhrd.service.NotificationService;
import com.smhrd.service.PredService;
import com.smhrd.service.SensorService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ServiceRestController {

    @Autowired
    private SensorService snsrService;

	@Autowired
	private NotificationService notifyService;

	@Autowired
	private PredService predService;
	
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
    		if(snsr.get(0).getPm1() > 35) {
    			//초미세먼지 경고 알림 보내기
    			notifyService.sendPm1Notify(stId, usrEmail, snsr.get(0).getPm1());
    		}
    	}    	
    	
    	if((snsr != null) && (snsr.get(0) != null) && (snsr.get(0).getPm25() != null)) {
    		if(snsr.get(0).getPm25() > 75) {
    			//초미세먼지 경고 알림 보내기
    			notifyService.sendPm25Notify(stId, usrEmail, snsr.get(0).getPm25());
    		}
    	}
    	
    	if((snsr != null) && (snsr.get(0) != null) && (snsr.get(0).getPm10() != null)) {
    		if(snsr.get(0).getPm10() > 80) {
    			//미세먼지 경고 알림 보내기
    			notifyService.sendPm10Notify(stId, usrEmail, snsr.get(0).getPm10());
    		}
    	}

    	if((snsr != null) && (snsr.get(0) != null) && (snsr.get(0).getCo2den() != null)) {
    		if (snsr.get(0).getCo2den().compareTo(BigDecimal.valueOf(900)) >= 0) {
    			System.out.println(snsr.get(0).getCo2den());
    			//Co2 경고 알림 보내기
    			notifyService.sendCo2Notify(stId, usrEmail, snsr.get(0).getCo2den().intValue());
    		}
    		else {
    			System.out.println("Not null");
    		}
    	}
    	return snsr;
    }
    
    @GetMapping("/getStationDustOne")
    public SensorPredResponse  getStationOneInfo(@RequestParam int stId, HttpServletRequest request) {
    	int originStId = stId;
    	stId = 1; //현재는 모든 데이터가 1번으로 저장되어 있어서 이걸로 처리'

    	String usrEmail = token.extractUserFromJwt(request);
    	if(usrEmail == null) {
    		return null;
    	}
    	
    	Sensor snsr = snsrService.getStDustOne(stId);
    	Pred pred = predService.getRecentPredByStId(originStId);
    	// 더미데이터를 불러 왔으니, 다시 stId값을 복구
    	stId = originStId;

    	//알림기능 테스트룰 위한 더미 센싱값
//    	snsr.setPm1(150);
//    	snsr.setPm25(50);
//    	snsr.setPm10(10);
//    	snsr.setCo2den(BigDecimal.valueOf(960));
//    	snsr.setCoden(BigDecimal.valueOf(7.212));
    	
    	if((snsr != null) && (snsr.getPm1() != null)) {
    		if(snsr.getPm1() > 35) {
    			//초미세먼지 경고 알림 보내기
    			notifyService.sendPm1Notify(stId, usrEmail, snsr.getPm1());
    		}
    	}    	
    	
    	if((snsr != null) && (snsr.getPm25() != null)) {
    		if(snsr.getPm25() > 35) {
    			//초미세먼지 경고 알림 보내기
    			notifyService.sendPm25Notify(stId, usrEmail, snsr.getPm25());
    		}
    	}
    	
    	if((snsr != null) && (snsr.getPm10() != null)) {
    		if(snsr.getPm10() > 80) {
    			//미세먼지 경고 알림 보내기
    			notifyService.sendPm10Notify(stId, usrEmail, snsr.getPm10());
    		}
    	}
    	if((snsr != null) && (snsr != null) && (snsr.getCo2den() != null)) {
    		if (snsr.getCo2den().compareTo(BigDecimal.valueOf(950)) >= 0) {
    			//Co2 경고 알림 보내기
    			notifyService.sendCo2Notify(stId, usrEmail, snsr.getCo2den().intValue());
    		}
    	}
    	return new SensorPredResponse(snsr, pred);
    }
    
    @GetMapping("/getAllNotify")
    public List<Notification> getAllNotify(HttpServletRequest request) {
        String usrEmail = token.extractUserFromJwt(request);
        if(usrEmail == null) {
            return Collections.emptyList();  // null 대신 빈 리스트 반환 권장
        }
        List<Notification> getAllList = notifyService.getAllNotify(usrEmail);
        return getAllList;
    }
    
    @PostMapping("/deleteAllNotification")
    public String deleteAllNotification(HttpServletRequest request) {
        if (!token.isUserLoggedIn(request)) {
            return "fail";
        }
        String usrEmail = token.extractUserFromJwt(request);
        if (usrEmail == null || usrEmail.isBlank()) {
            return "fail";
        }

        return notifyService.deleteAllNotification(usrEmail) ? "success" : "fail";
    }

    @PostMapping("/deleteOneNotification")
    public String deleteOneNotification(@RequestParam Integer notiId, HttpServletRequest request) {
        if (!token.isUserLoggedIn(request)) {
            return "fail";
        }
        String usrEmail = token.extractUserFromJwt(request);
        if (notiId == null || usrEmail == null || usrEmail.isBlank()) {
            return "fail";
        }
        Notification notify = new Notification();
        notify.setNotiId(notiId);
        notify.setUsrEmail(usrEmail);
        return notifyService.deleteOneNotification(notify) ? "success" : "fail";
    }
    
    @PostMapping("/notifyRead")
    public ResponseEntity<?> markNotificationsAsRead(@RequestBody Map<String, List<Integer>> payload) {
        List<Integer> notiIds = payload.get("notiIds");
        if (notiIds == null || notiIds.isEmpty()) {
            return ResponseEntity.ok(Map.of("status", "fail", "message", "알림 ID가 없습니다."));
        }

        try {
        	notifyService.markNotificationsAsRead(notiIds);
            return ResponseEntity.ok(Map.of("status", "success", "message", "읽음 처리를 완료하였습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "서버 오류 발생", "detail", e.getMessage()));
            }
    }
    
    @GetMapping("/weekday/{weekday}")
    public Map<String, Object> getAvgPmByAmPm(@PathVariable String weekday) {
        List<Map<String, Object>> result = new ArrayList<>();

        //System.out.println("weekday = " + weekday);
        try {
            result = snsrService.findMinuteAvgPmByDateGroupedByPeriod(weekday);
        } catch (Exception e) {
            e.printStackTrace();
        }


        //System.out.println("weekday = " + weekday);
        if (result.isEmpty()) {
            return Map.of(
                "xLabels", (Object)List.of("AM", "PM"),
                "amAvgPm1", 0,
                "amAvgPm25", 0,
                "amAvgPm10", 0,
                "pmAvgPm1", 0,
                "pmAvgPm25", 0,
                "pmAvgPm10", 0,
                
               "amAvgCoden", 0,
                "pmAvgCoden",0 ,
                "amAvgCo2den",0,
                "pmAvgCo2den",0
                
            );
        }

        Map<String, Object> row = result.get(0);

        return Map.ofEntries(
        	    Map.entry("xLabels", List.of("AM", "PM")),
        	    Map.entry("amAvgPm1", row.getOrDefault("amAvgPm1", 0)),
        	    Map.entry("amAvgPm25", row.getOrDefault("amAvgPm25", 0)),
        	    Map.entry("amAvgPm10", row.getOrDefault("amAvgPm10", 0)),
        	    Map.entry("pmAvgPm1", row.getOrDefault("pmAvgPm1", 0)),
        	    Map.entry("pmAvgPm25", row.getOrDefault("pmAvgPm25", 0)),
        	    Map.entry("pmAvgPm10", row.getOrDefault("pmAvgPm10", 0)),
        	    Map.entry("amAvgCo2den", row.getOrDefault("amAvgCo2den", 0)),
        	    Map.entry("pmAvgCo2den", row.getOrDefault("pmAvgCo2den", 0))
        	);

    }



}
