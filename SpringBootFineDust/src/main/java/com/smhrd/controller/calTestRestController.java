package com.smhrd.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.repository.SensorRepository;

@RestController
public class calTestRestController {
    @Autowired
    private SensorRepository sensorRepository;

    @GetMapping("/dust-data/{weekday}")
    public List<Map<String, Object>> getDustData(@PathVariable String weekday, String st_id) {
    	
    	LocalDate parsedDate = LocalDate.parse(weekday);
    	weekday = parsedDate.getDayOfWeek().toString();
        List<Map<String, Object>> results = sensorRepository.findMinuteAvgPmByDateGroupedByPeriod(weekday);
        // {date} 의 먼지 데이터 불러오기 
        return results;
    }
}
