package com.smhrd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Station;

public interface StationRepository extends JpaRepository<Station, Integer>{

	List<Station> findAllByUsrEmail(String usrEmail);

}
