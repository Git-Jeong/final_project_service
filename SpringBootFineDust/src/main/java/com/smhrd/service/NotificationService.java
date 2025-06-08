package com.smhrd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.smhrd.entity.Notification;
import com.smhrd.entity.Station;
import com.smhrd.repository.NotificationRepository;
import com.smhrd.repository.StationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private StationRepository stRepository;
    
    public void sendPm1Notify(int stId, String usrEmail, Integer pm1) {
        Station station = stRepository.findById(stId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역 ID입니다."));
        String stationName = station.getStName_1();

        Notification notification = new Notification();
        notification.setUsrEmail(usrEmail);

        if (pm1 >= 40) {
            notification.setNotiType(Notification.NotiType.error);
            notification.setNotiTitle(stationName + " 극초미세먼지 경고");
            notification.setNotiContent_1(stationName + " 초미세먼지 값이 너무 높음");
        } else if (pm1 >= 20) {
            notification.setNotiType(Notification.NotiType.warning);
            notification.setNotiTitle(stationName + " 극초미세먼지 알림");
            notification.setNotiContent_1(stationName + " pm1 값이 높음");
        } else {
            return; // 알림 생성하지 않음 (pm1 20 미만은 무시)
        }

        notification.setNotiContent_2("PM1 : " + pm1);
        notification.setNotiUnit("pm1");
        notification.setStation(station);
        if (isDuplicateNotification(stId, notification.getNotiType(), notification.getNotiUnit())) {
        	return;
        }
        else {
            notificationRepository.save(notification);
		}
    }
    
    public void sendPm25Notify(int stId, String usrEmail, Integer pm25) {
        Station station = stRepository.findById(stId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역 ID입니다."));
        String stationName = station.getStName_1();

        Notification notification = new Notification();
        notification.setUsrEmail(usrEmail);

        if (pm25 >= 40) {
            notification.setNotiType(Notification.NotiType.error);
            notification.setNotiTitle(stationName + " 초미세먼지 경고");
            notification.setNotiContent_1(stationName + " 초미세먼지 값이 너무 높음");
        } else if (pm25 >= 20) {
            notification.setNotiType(Notification.NotiType.warning);
            notification.setNotiTitle(stationName + " 초미세먼지 알림");
            notification.setNotiContent_1(stationName + " pm2.5 값이 높음");
        } else {
            return; // 알림 생성하지 않음 (pm1 20 미만은 무시)
        }

        notification.setNotiContent_2("pm25 : " + pm25);
        notification.setNotiUnit("pm25");
        notification.setStation(station);
        if (isDuplicateNotification(stId, notification.getNotiType(), notification.getNotiUnit())) {
        	return;
        }
        else {
            notificationRepository.save(notification);
		}
    }
    
    public void sendPm10Notify(int stId, String usrEmail, Integer pm10) {
        Station station = stRepository.findById(stId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역 ID입니다."));
        String stationName = station.getStName_1();

        Notification notification = new Notification();
        notification.setUsrEmail(usrEmail);

        if (pm10 >= 40) {
            notification.setNotiType(Notification.NotiType.error);
            notification.setNotiTitle(stationName + " 미세먼지 경고");
            notification.setNotiContent_1(stationName + " 값이 너무 높음");
        } else if (pm10 >= 20) {
            notification.setNotiType(Notification.NotiType.warning);
            notification.setNotiTitle(stationName + " 미세먼지 알림");
            notification.setNotiContent_1(stationName + " pm10 미세먼지 값이 높음");
        } else {
            return; // 알림 생성하지 않음 (pm1 20 미만은 무시)
        }

        notification.setNotiContent_2("pm10 : " + pm10);
        notification.setNotiUnit("pm10");
        notification.setStation(station);
        if (isDuplicateNotification(stId, notification.getNotiType(), notification.getNotiUnit())) {
        	return;
        }
        else {
            notificationRepository.save(notification);
		}
    }
    
    
    private boolean isDuplicateNotification(int stId, Notification.NotiType notiType, String notiUnit) {
        boolean result = false;
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        
        Notification getNotify = notificationRepository.findTopByStation_StIdAndNotiUnitOrderByNotiTimeDesc(stId, notiUnit);
        
        if (getNotify == null || getNotify.getNotiType().name() == null) {
            return result; // 알림 없음 → 중복 아님
        }

        if (getNotify.getNotiTime().isBefore(oneHourAgo)) {
            return result; // 1시간 이전 알림 → 중복 아님
        }
        
        String inputType = notiType.name();
        String findType = getNotify.getNotiType().name();
        
        if(findType.equals("error")) {
        	result = true; 
        }
        else if(findType.equals("warning")) {
        	if(inputType.equals("warning")) {
            	result = true; 
        	}
        	else if(inputType.equals("info")) {
            	result = true; 
        	}
		}
        else if(findType.equals("info")) {
        	if(inputType.equals("info")) {
            	result = true; 
        	}
		}
        
        return result;
    }

    public List<Notification> getAllNotify(String usrEmail) {
        List<Notification> getAllList = notificationRepository.findTop10ByUsrEmailOrderByNotiTimeDesc(usrEmail);
        return getAllList != null ? getAllList : new ArrayList<>();
    }


}
