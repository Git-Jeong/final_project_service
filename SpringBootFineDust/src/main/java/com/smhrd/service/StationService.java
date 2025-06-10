package com.smhrd.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smhrd.entity.Station;
import com.smhrd.repository.StationRepository;

@Service
public class StationService {

	@Autowired
	private StationRepository stRepository;
	
	public boolean insertSt(Station st) {
		st.setStId(null);
		try {
	    	stRepository.save(st);
	        return true;
	    } catch (Exception e) {
	        e.printStackTrace(); // 예외 메시지 출력 추가
	        return false;
	    }
	}

	public List<Station> getStInfo(String usrEmail) {
		List<Station> st = stRepository.findAllByUsrEmail(usrEmail);
		if(st == null) {
		    return new ArrayList<>();
		}
		return st;
	}

	public void setStInfo(Station st) {
		stRepository.save(st);
	}
}
