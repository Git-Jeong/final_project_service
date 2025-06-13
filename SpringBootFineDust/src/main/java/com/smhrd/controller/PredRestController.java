package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpStatus; 
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.List;

import com.smhrd.config.TokenCheck;
import com.smhrd.entity.Pred;
import com.smhrd.service.PredService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class PredRestController {

	@Autowired
	private PredService flaskService;

    @Autowired
    private TokenCheck token;
    
	// Flask 연동 및 Pred 저장 컨트롤러 구현
	@PostMapping("/savePred")
	public boolean startPred(@RequestBody int stId, HttpServletRequest request) {
		int originStId = stId;
		stId= 1;
		
		String usrEmail = token.extractUserFromJwt(request);
        if(usrEmail == null) {
            return false;  // null 대신 빈 리스트 반환 권장
        }
	    try { //127.0.0.1:5000
	        String flaskUrl = "http://127.0.0.1:5000/flask-station-db-test?st_id=" + stId;
	        RestTemplate restTemplate = new RestTemplate();

	        ResponseEntity<Object> response = restTemplate.getForEntity(flaskUrl, Object.class);
	        
	        stId = originStId;
	        
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
	public Pred getPred(@RequestBody int stId, HttpServletRequest request) {
        String usrEmail = token.extractUserFromJwt(request);
        if(usrEmail == null) {
            return new Pred();  // null 대신 빈 리스트 반환 권장
        }
        Pred pred = flaskService.getRecentPredByStId(stId);
        if((pred == null) || (pred.getPm1() == null)) {
        	return new Pred(); 
        }
	    return pred;
	}

}
