package com.smhrd.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smhrd.entity.Station;

public interface StationRepository extends JpaRepository<Station, Integer>{

	Station findByUsrEmail(String usrEmail);

	ArrayList<Station> findTop10ByStIdAndWeekdayAndTimeHmsLessThanEqualOrderByTimeHmsDesc(int stId, String weekday,
			String timeHms);


}
