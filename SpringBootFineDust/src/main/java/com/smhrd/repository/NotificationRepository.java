package com.smhrd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

	Notification findTopByStation_StIdAndNotiUnitOrderByNotiTimeDesc(int stId, String notiUnit);

	List<Notification> findTop10ByUsrEmailOrderByNotiTimeDesc(String usrEmail);

	int deleteAllByUsrEmail(String usrEmail);

	int deleteByUsrEmailAndNotiId(String usrEmail, Integer notiId);

}
