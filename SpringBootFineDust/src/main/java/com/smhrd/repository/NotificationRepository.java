package com.smhrd.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

	Notification findTopByStation_StIdAndNotiUnitOrderByNotiTimeDesc(int stId, String notiUnit);

	ArrayList<Notification> findAllByUsrEmail(String usrEmail);

}
