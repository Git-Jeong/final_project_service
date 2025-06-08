package com.smhrd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
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
        if (isDuplicateNotification(usrEmail, notification.getNotiTitle())) return;
        notificationRepository.save(notification);
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
        if (isDuplicateNotification(usrEmail, notification.getNotiTitle())) return;
        notificationRepository.save(notification);
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
        if (isDuplicateNotification(usrEmail, notification.getNotiTitle())) return;
        notificationRepository.save(notification);
    }
    
    private boolean isDuplicateNotification(String usrEmail, String stationName) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        return notificationRepository.findTopByUsrEmailAndNotiTitleOrderByNotiTimeDesc(usrEmail, stationName)
            .filter(n -> n.getNotiTime().isAfter(oneHourAgo))
            .isPresent();
    }
}
