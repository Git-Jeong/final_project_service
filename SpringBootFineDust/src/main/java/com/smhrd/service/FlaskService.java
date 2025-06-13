package com.smhrd.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smhrd.entity.Pred;
import com.smhrd.repository.PredRepository;

@Service
public class FlaskService {
	
	@Autowired
	private PredRepository predRepository;
    
	public boolean savePred(Pred pred) {
	    Pred saved = predRepository.save(pred);
	    return saved != null;
	}
	
	public Pred getRecentPredByStId(int stId) {
	    return predRepository.findTopByStIdOrderByPmTimeDesc(stId);
	}

}
