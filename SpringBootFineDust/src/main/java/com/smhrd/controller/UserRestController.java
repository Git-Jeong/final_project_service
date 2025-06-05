package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smhrd.config.AESUtils;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class UserRestController {

	@Autowired
	private UserService service;

    @Autowired
    private AESUtils AesUtils;
    
    @Value("${jwt.cookie.name}")
    private String token_login;
    
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
    
    @GetMapping("/getUserInfo")
    public User getStationInfo(@RequestParam String usrEmail) {
    	User m = new User();
        m.setUsrEmail(usrEmail);
        User vo = service.getUserInfo(m);
    	return vo;
    }
    
    @PostMapping("/updateUserInfo")
    public String updateUserInfo(@RequestBody User vo) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		String aesPw = AesUtils.encrypt(vo.getUsrPw());
    		if(aesPw == null) {
    	        return "err";
    		}
			vo.setUsrPw(aesPw);
    	}
        service.setUserInfo(vo);
        return "success";
    }
    
    @PostMapping("/checkEmailNick")
    public String checkEmailNick(@RequestBody User vo) {
    	String userName = null;
    	if((vo != null) && (vo.getUsrNick() != null) && (vo.getUsrEmail() != null)) {
            userName = service.findByEmailForNickEmail(vo);
    	}
        return userName;
    }

    @PostMapping("/logout")
    public String logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(token_login, null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "success";
    }
}
