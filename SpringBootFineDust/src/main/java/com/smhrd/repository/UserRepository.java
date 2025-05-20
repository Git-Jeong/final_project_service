package com.smhrd.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smhrd.entity.User;

public interface UserRepository extends JpaRepository<User, String>{

}
