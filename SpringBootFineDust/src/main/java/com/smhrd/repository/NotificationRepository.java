package com.smhrd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Notification;
import com.smhrd.entity.Notification.NotiType;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
	
	//Optional<Notification> findTopByStIdAndNotiTypeAndNotiUnitOrderByNotiTimeDesc(int stId, NotiType notiType, String notiUnit);
}
