package com.smhrd.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.entity.Station;
import com.smhrd.repository.StationRepository;

@Service
public class StationService {

	@Autowired
	private StationRepository repository;

	public boolean insertSt(Station st) {
	    try {
	        repository.save(st);
	        return true;
	    } catch (Exception e) {
	        return false;
	    }
	}

	
	
}
