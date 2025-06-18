package com.smhrd.repository;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.smhrd.entity.Sensor;

public interface SensorRepository extends JpaRepository<Sensor, Integer> {

	ArrayList<Sensor> findTop10ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(int stId, String weekday,
	        LocalTime timeHms);

	Sensor findTop1ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(int stId, String weekday,
			LocalTime timeHms);

    @Query(value = """
            SELECT
      AVG(CASE WHEN HOUR(time_hms) < 12 THEN pm1 END) AS amAvgPm1,
      AVG(CASE WHEN HOUR(time_hms) < 12 THEN pm25 END) AS amAvgPm25,
      AVG(CASE WHEN HOUR(time_hms) < 12 THEN pm10 END) AS amAvgPm10,
      AVG(CASE WHEN HOUR(time_hms) >= 12 THEN pm1 END) AS pmAvgPm1,
      AVG(CASE WHEN HOUR(time_hms) >= 12 THEN pm25 END) AS pmAvgPm25,
      AVG(CASE WHEN HOUR(time_hms) >= 12 THEN pm10 END) AS pmAvgPm10,
      
      AVG(CASE WHEN HOUR(time_hms) < 12 THEN coden END) AS amAvgCoden,
      AVG(CASE WHEN HOUR(time_hms) >= 12 THEN coden END) AS pmAvgCoden,
      
      AVG(CASE WHEN HOUR(time_hms) < 12 THEN co2den END) AS amAvgCo2den,
      AVG(CASE WHEN HOUR(time_hms) >= 12 THEN co2den END) AS pmAvgCo2den
    		
      
    FROM sensor
    WHERE weekday = :weekday AND st_id = 1
            """, nativeQuery = true)
        List<Map<String, Object>> findMinuteAvgPmByDateGroupedByPeriod(@Param("weekday") String date);
    }  //stId, weekday, timeHms 를 추가해줘야 함
		// '%Y-%m-%d %H:%i'




