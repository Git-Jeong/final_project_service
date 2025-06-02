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

	public Station getStInfo(String usrEmail) {
		// TODO Auto-generated method stub
		Station st = repository.findByUsrEmail(usrEmail);
		if(st == null) {
		    return new Station();
		}
		return st;
	}

	public void setStInfo(Station st) {
		// TODO Auto-generated method stub
		repository.save(st);
	}

	
	
}
