package com.smhrd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.config.EncryptionUtil;
import com.smhrd.config.TokenCheck;
import com.smhrd.entity.User;
import com.smhrd.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
public class UserRestController {

	@Autowired
	private UserService service;

    @Autowired
    private EncryptionUtil EncryptionUtil;
    
    @Autowired
    private TokenCheck token;
    
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
    		String aesPw = EncryptionUtil.encrypt(vo.getUsrPw());
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
    public String updateUserInfo(@RequestBody User vo, HttpServletRequest request) {
    	if((vo != null) && (vo.getUsrPw() != null)) {
    		String aesPw = EncryptionUtil.encrypt(vo.getUsrPw());
    		String userEmail = token.extractUserFromJwt(request);
    		if((aesPw == null) || (userEmail == null)) {
    	        return "err";
    		}
    		vo.setUsrEmail(userEmail);
    		//만약을 대비하여 유저 닉네임은 다시 처리
			vo.setUsrPw(aesPw);
    	}
        service.setUserInfo(vo);
        return "success";
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
