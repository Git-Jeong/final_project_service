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
	
	public User idCheck(String usrEmail) {
	    Optional<User> optionalUser = repository.findById(usrEmail);
	    
	    if (optionalUser.isPresent()) {
	        User user = optionalUser.get();
	        User info = new User();
	        info.setUsrEmail(user.getUsrEmail());
	        return info;
	    } else {
	        return new User();
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
		boolean result = repository.findById(vo.getUsrEmail()).isPresent();
		return result;
	}

	public User getUserInfo(User vo) {
		Optional<User> m = repository.findById(vo.getUsrEmail());
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
