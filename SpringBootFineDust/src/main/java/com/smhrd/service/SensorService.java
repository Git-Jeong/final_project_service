package com.smhrd.service;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.entity.Pred;
import com.smhrd.entity.Sensor;
import com.smhrd.repository.PredRepository;
import com.smhrd.repository.SensorRepository;

@Service
public class SensorService {

	@Autowired
	private SensorRepository snsrRepository;

	public ArrayList<Sensor> getStDust(int stId) {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String weekday = now.getDayOfWeek().toString(); // 예: MONDAY
		LocalTime timeHms = now.toLocalTime();

		return snsrRepository.findTop10ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(
			stId, weekday, timeHms
		);
	}

	public Sensor getStDustOne(int stId) {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String weekday = now.getDayOfWeek().toString(); // 예: MONDAY
		LocalTime timeHms = now.toLocalTime();

		return snsrRepository.findTop1ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(
			stId, weekday, timeHms
		);
	}

	public List<Map<String, Object>> findMinuteAvgPmByDateGroupedByPeriod(String weekday) {
		return snsrRepository.findMinuteAvgPmByDateGroupedByPeriod(weekday);
	}
}
