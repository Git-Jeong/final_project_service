package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.entity.User;
import com.smhrd.service.UserService;

@RestController
public class UserRestController {

	@Autowired
	private UserService service;
	
	@GetMapping("/idCheck")
	public User idCheck(@RequestParam("id") String id) {
		User m = service.idCheck(id);
		return m;
	}
}
