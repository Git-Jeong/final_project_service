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
      ROUND(AVG(CASE WHEN HOUR(time_hms) < 12 THEN pm1 END),2) AS amAvgPm1,
      ROUND(AVG(CASE WHEN HOUR(time_hms) < 12 THEN pm25 END),2) AS amAvgPm25,
      ROUND(AVG(CASE WHEN HOUR(time_hms) < 12 THEN pm10 END),2) AS amAvgPm10,
      ROUND(AVG(CASE WHEN HOUR(time_hms) >= 12 THEN pm1 END),2) AS pmAvgPm1,
      ROUND(AVG(CASE WHEN HOUR(time_hms) >= 12 THEN pm25 END),2) AS pmAvgPm25,
      ROUND(AVG(CASE WHEN HOUR(time_hms) >= 12 THEN pm10 END),2) AS pmAvgPm10,
      
      ROUND(AVG(CASE WHEN HOUR(time_hms) < 12 THEN coden END),2) AS amAvgCoden,
      ROUND(AVG(CASE WHEN HOUR(time_hms) >= 12 THEN coden END),2) AS pmAvgCoden,
      
      ROUND(AVG(CASE WHEN HOUR(time_hms) < 12 THEN co2den END),2) AS amAvgCo2den,
      ROUND(AVG(CASE WHEN HOUR(time_hms) >= 12 THEN co2den END),2) AS pmAvgCo2den
    		
      
    FROM sensor
    WHERE weekday = :weekday AND st_id = 1
            """, nativeQuery = true)
        List<Map<String, Object>> findMinuteAvgPmByDateGroupedByPeriod(@Param("weekday") String date);
    }  //stId, weekday, timeHms 를 추가해줘야 함
		// '%Y-%m-%d %H:%i'




