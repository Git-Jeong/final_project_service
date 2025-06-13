package com.smhrd.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus; 
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smhrd.entity.Pred;
import com.smhrd.service.FlaskService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class FlaskApiController {

	@Autowired
	private FlaskService flaskService;
	
	// Flask 연동 및 Pred 저장 컨트롤러 구현

	@PostMapping("/savePred")
	public boolean startPred(@RequestBody int stId, HttpServletRequest request) {
	    try {
	        String flaskUrl = "http://localhost:5000/flask-station-db-test?st_id=" + stId;
	        RestTemplate restTemplate = new RestTemplate();

	        ResponseEntity<Object> response = restTemplate.getForEntity(flaskUrl, Object.class);

	        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
	            // Object를 JSON 형태의 List<List<Double>>로 변환
	            ObjectMapper mapper = new ObjectMapper();
	            List<List<Double>> predList = mapper.convertValue(
	                response.getBody(),
	                new TypeReference<List<List<Double>>>() {}
	            );
	            List<Double> predValues = predList.get(0);

	            Pred pred = new Pred();
	            pred.setPm1(predValues.get(0).intValue());
	            pred.setPm25(predValues.get(1).intValue());
	            pred.setPm10(predValues.get(2).intValue());
	            pred.setPmTime(LocalDateTime.now());
	            pred.setStId(stId);

	            return flaskService.savePred(pred);
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return false;
	}
	
	@PostMapping("/getPred")
	public List<Pred> getPred(@RequestBody int stId, HttpServletRequest request) {
	    return flaskService.getRecentPredsByStId(stId);
	}

}
