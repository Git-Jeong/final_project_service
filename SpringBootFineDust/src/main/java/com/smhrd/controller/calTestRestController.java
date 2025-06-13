package com.smhrd.controller;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.service.SensorService;

@RestController
public class calTestRestController {
	
    @Autowired
    private SensorService sensorService;
    
    @GetMapping("/dust-data/{dateStr}")
    public List<Map<String, Object>> getDustData(@PathVariable String dateStr, String st_id) {
        LocalDate date = LocalDate.parse(dateStr); // "2025-06-01" → LocalDate 변환
        DayOfWeek dayOfWeek = date.getDayOfWeek(); // 해당 날짜 요일 추출
        String dayStr = dayOfWeek.toString(); // enum → 대문자 문자열 (예: "MONDAY")

        List<Map<String, Object>> results = sensorService.findMinuteAvgPmByDateGroupedByPeriod(dayStr);
        return results;
    }


}
