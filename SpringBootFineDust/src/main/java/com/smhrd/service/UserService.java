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
	
	public User idCheck(String mem_email) {
		Optional<User> m = repository.findById(mem_email);
		if(m.isPresent()) {
			User info = new User();
			String findId = m.get().getMem_email();
			info.setMem_email(mem_email);
			return info;
		}
		else {
			return new User();
		}
	}

	public void join(User vo) {
		repository.save(vo);
	}

	public User login(User vo) {
		User m = repository.findByIdAndPw(vo.getMem_email(), vo.getMem_pw());
		if(m != null) {
	    	m.setMem_pw(null);
		}
		return m;
	}

	public boolean tokenCheck(User vo) {
		boolean result = repository.findById(vo.getMem_email()).isPresent();
		return result;
	}

	public User getMemberInfo(User vo) {
		Optional<User> m = repository.findById(vo.getMem_email());
		if(m.isPresent()) {
			m.get().setMem_pw(null);
			return m.get();
		}
		else {
			return new User();
		}
	}

	public void setMemberInfo(User vo) {
		repository.save(vo);
	}

	public ArrayList<User> getAllUser() {
		// TODO Auto-generated method stub
		ArrayList<User> m = (ArrayList<User>)repository.findAll();
		for(int i=0; i<m.size(); i++) {
			m.get(i).setMem_pw(null);
		}
		return m;
	}

	public void goDelete(String mem_email) {
		repository.deleteById(mem_email);
	}
	
}
