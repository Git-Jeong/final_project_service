package com.smhrd.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smhrd.entity.Pred;
import com.smhrd.repository.PredRepository;

@Service
public class PredService {
	
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
