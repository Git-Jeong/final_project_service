package com.smhrd.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.config.TokenCheck;
import com.smhrd.entity.Pred;
import com.smhrd.repository.PredRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FlaskService {
	
	@Autowired
	private PredRepository predRepository;

    @Autowired
    private TokenCheck token;
    
	public boolean savePred(Pred pred, HttpServletRequest request) {
        String usrEmail = token.extractUserFromJwt(request);
        if(usrEmail == null) {
            return false;  // null 대신 빈 리스트 반환 권장
        }
	    Pred saved = predRepository.save(pred);
	    return saved != null;
	}
	
	public List<Pred> getRecentPredsByStId(int stId, HttpServletRequest request) {
        String usrEmail = token.extractUserFromJwt(request);
        if(usrEmail == null) {
            return Collections.emptyList();  // null 대신 빈 리스트 반환 권장
        }
        
	    LocalDateTime timeThreshold = LocalDateTime.now().minusSeconds(30);
	    return predRepository.findByStIdAndPmTimeAfterOrderByPmTimeDesc(stId, timeThreshold);
	}

}
