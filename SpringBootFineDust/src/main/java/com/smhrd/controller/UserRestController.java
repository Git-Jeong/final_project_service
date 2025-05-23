package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.User;
import com.smhrd.service.UserService;

@RestController
public class UserRestController {

	@Autowired
	private UserService service;
	
	@GetMapping("/idCheck")
	public boolean idCheck(@RequestParam("usrEmail") String usrEmail) {
		boolean m = service.idCheck(usrEmail);
		return m;
	}

    @PostMapping("/signup")
    public String join(@RequestBody User vo) {
        service.join(vo);
        return "success";
    }
}
