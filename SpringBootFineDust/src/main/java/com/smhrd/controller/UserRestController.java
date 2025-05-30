package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.config.AESUtils;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;

@RestController
public class UserRestController {

	@Autowired
	private UserService service;

    @Autowired
    private AESUtils AesUtils;
    
	@GetMapping("/idCheck")
	public boolean idCheck(@RequestParam("usrEmail") String usrEmail) {
		boolean m = service.idCheck(usrEmail);
		return m;
	}

    @PostMapping("/signup")
    public String join(@RequestBody User vo) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		String aesPw = AesUtils.encrypt(vo.getUsrPw());
    		if(aesPw == null) {
                return "redirect:/update";
    		}
			vo.setUsrPw(aesPw);
    	}
        service.join(vo);
        return "success";
    }
}
