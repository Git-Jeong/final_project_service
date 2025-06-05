package com.smhrd.service;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.entity.Sensor;
import com.smhrd.repository.SensorRepository;

@Service
public class SensorService {

	@Autowired
	private SensorRepository repository;

	public ArrayList<Sensor> getStDust(int stId) {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String weekday = now.getDayOfWeek().toString(); // 예: MONDAY
		LocalTime timeHms = now.toLocalTime();

		return repository.findTop10ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(
			stId, weekday, timeHms
		);
	}


	
	
}
