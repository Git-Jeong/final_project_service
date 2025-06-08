package com.smhrd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        notification.setUsr_email(usrEmail);

        if (pm1 >= 40) {
            notification.setNoti_type(Notification.NotiType.error);
            notification.setNoti_title(stationName + " 초미세먼지 경고");
            notification.setNoti_content_1(stationName + " 초미세먼지 값이 너무 높음");
        } else if (pm1 >= 20) {
            notification.setNoti_type(Notification.NotiType.warning);
            notification.setNoti_title(stationName + " 초미세먼지 알림");
            notification.setNoti_content_1(stationName + " 초미세먼지 값이 높음");
        } else {
            return; // 알림 생성하지 않음 (pm1 20 미만은 무시)
        }

        notification.setNoti_content_2(stationName + " PM1 : " + pm1);
        notificationRepository.save(notification);
    }
    
    public void sendPm25Notify(int stId, String usrEmail, Integer pm25) {
        Station station = stRepository.findById(stId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역 ID입니다."));
        String stationName = station.getStName_1();

        Notification notification = new Notification();
        notification.setUsr_email(usrEmail);

        if (pm25 >= 40) {
            notification.setNoti_type(Notification.NotiType.error);
            notification.setNoti_title(stationName + " 초미세먼지 경고");
            notification.setNoti_content_1(stationName + " 초미세먼지 값이 너무 높음");
        } else if (pm25 >= 20) {
            notification.setNoti_type(Notification.NotiType.warning);
            notification.setNoti_title(stationName + " 초미세먼지 알림");
            notification.setNoti_content_1(stationName + " 초미세먼지 값이 높음");
        } else {
            return; // 알림 생성하지 않음 (pm1 20 미만은 무시)
        }

        notification.setNoti_content_2(stationName + " pm25 : " + pm25);
        notificationRepository.save(notification);
    }
    
    public void sendPm10Notify(int stId, String usrEmail, Integer pm10) {
        Station station = stRepository.findById(stId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 역 ID입니다."));
        String stationName = station.getStName_1();

        Notification notification = new Notification();
        notification.setUsr_email(usrEmail);

        if (pm10 >= 40) {
            notification.setNoti_type(Notification.NotiType.error);
            notification.setNoti_title(stationName + " 미세먼지 경고");
            notification.setNoti_content_1(stationName + " 미세먼지 값이 너무 높음");
        } else if (pm10 >= 20) {
            notification.setNoti_type(Notification.NotiType.warning);
            notification.setNoti_title(stationName + " 미세먼지 알림");
            notification.setNoti_content_1(stationName + " 미세먼지 값이 높음");
        } else {
            return; // 알림 생성하지 않음 (pm1 20 미만은 무시)
        }

        notification.setNoti_content_2(stationName + " pm10 : " + pm10);
        notificationRepository.save(notification);
    }

}
