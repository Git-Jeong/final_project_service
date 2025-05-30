package com.smhrd.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.entity.Station;

@RestController
public class StationRestController {

    @PostMapping("/update-station")
    public String mypage(Station st) {
       //service.setUserInfo(vo);
        return "success";
    }
}
