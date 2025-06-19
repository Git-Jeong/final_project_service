package com.smhrd.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.entity.Sensor;
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
	
	public Sensor getStDustAvg(int stId) {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		LocalDate today = now.toLocalDate();
		LocalTime currentTime = now.toLocalTime();

		List<Sensor> sensors = snsrRepository.findByStIdAndWeekdayAndTimeHmsLessThanEqual(
			    stId, 
			    today.getDayOfWeek().name(),  // 영어 요일 문자열 (e.g., "MONDAY")
			    currentTime                  // hh:mm:ss 타입(LocalTime)
			);

		if (sensors.isEmpty()) {
			Sensor emptySensor = new Sensor();
			emptySensor.setPm1(0);
			emptySensor.setPm25(0);
			emptySensor.setPm10(0);
			return emptySensor;
		}

		int avgPm1 = (int) Math.round(sensors.stream().mapToDouble(Sensor::getPm1).average().orElse(0));
		int avgPm25 = (int) Math.round(sensors.stream().mapToDouble(Sensor::getPm25).average().orElse(0));
		int avgPm10 = (int) Math.round(sensors.stream().mapToDouble(Sensor::getPm10).average().orElse(0));

		Sensor avgSensor = new Sensor();
		avgSensor.setPm1(avgPm1);
		avgSensor.setPm25(avgPm25);
		avgSensor.setPm10(avgPm10);

		return avgSensor;
	}
	
	public List<Map<String, Object>> findMinuteAvgPmByDateGroupedByPeriod(String weekday) {
		return snsrRepository.findMinuteAvgPmByDateGroupedByPeriod(weekday);
	}

	public List<Map<String, Object>> findHourlyAvgByWeekdayAndStId(String weekday) {
		// TODO Auto-generated method stub
		return snsrRepository.findHourlyAvgByWeekdayAndStId(weekday);
	}


}
