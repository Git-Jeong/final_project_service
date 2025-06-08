package com.smhrd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
	Optional<Notification> findTopByUsrEmailAndNotiTitleOrderByNotiTimeDesc(String usrEmail, String notiTitle);
}
