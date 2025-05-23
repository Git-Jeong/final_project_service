package com.smhrd.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smhrd.entity.User;
import com.smhrd.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;
	
	public boolean idCheck(String usrEmail) {
	    Optional<User> optionalUser = repository.findByUsrEmail(usrEmail);
	    
	    if (optionalUser.isPresent()) {
	        return true;
	    } else {
	        return false;
	    }
	}

	public void join(User vo) {
		repository.save(vo);
	}

	public User login(User vo) {
		User m = repository.findByUsrEmailAndUsrPw(vo.getUsrEmail(), vo.getUsrPw());
		if(m != null) {
	    	m.setUsrPw(null);
		}
		return m;
	}

	public boolean tokenCheck(User vo) {
	    Optional<User> optionalUser = repository.findByUsrEmail(vo.getUsrEmail());
	    boolean result = optionalUser.isPresent();  // null이면 false, 있으면 true
	    return result;
	}

	public User getUserInfo(User vo) {
		Optional<User> m = repository.findByUsrEmail(vo.getUsrEmail());
		if(m.isPresent()) {
			m.get().setUsrPw(null);
			return m.get();
		}
		else {
			return new User();
		}
	}

	public void setUserInfo(User vo) {
		repository.save(vo);
	}

	public ArrayList<User> getAllUser() {
		ArrayList<User> m = (ArrayList<User>)repository.findAll();
		for(int i=0; i<m.size(); i++) {
			m.get(i).setUsrPw(null);
		}
		return m;
	}
	
}
