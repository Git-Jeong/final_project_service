package com.smhrd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Station;

public interface StationRepository extends JpaRepository<Station, Integer>{

	Station findByUsrEmail(String usrEmail);

}
