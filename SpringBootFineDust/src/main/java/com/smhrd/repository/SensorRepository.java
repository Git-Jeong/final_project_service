package com.smhrd.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smhrd.entity.Sensor;

public interface SensorRepository extends JpaRepository<Sensor, Integer>{

	ArrayList<Sensor> findTop10ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(int stId, String weekday,
			String timeHms);


}
