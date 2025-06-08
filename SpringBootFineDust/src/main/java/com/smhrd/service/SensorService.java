package com.smhrd.service;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;

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

	
	@Autowired
	private PredRepository prRepository;

	public ArrayList<Sensor> getStDust(int stId) {
		LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		String weekday = now.getDayOfWeek().toString(); // 예: MONDAY
		LocalTime timeHms = now.toLocalTime();

		return snsrRepository.findTop10ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(
			stId, weekday, timeHms
		);
	}

	// 현재 시각 기준, 과거(이전 또는 같은 시각)의 예측 정보 10개 조회 (최근 → 과거 순)
	public ArrayList<Pred> getPastPredInfo(int stId) {
		LocalDateTime pmTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		return prRepository.findTop10ByStIdAndPmTimeLessThanEqualOrderByPmTimeDesc(
				stId, pmTime
		);
	}

	// 현재 시각 기준, 미래(같거나 이후 시각)의 예측 정보 10개 조회 (가까운 미래 → 먼 미래 순)
	public ArrayList<Pred> getFuturePredInfo(int stId) {
		LocalDateTime pmTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
		return prRepository.findTop10ByStIdAndPmTimeGreaterThanEqualOrderByPmTimeAsc(
				stId, pmTime
		);
	}
	
}
