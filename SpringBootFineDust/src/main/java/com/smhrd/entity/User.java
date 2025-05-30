package com.smhrd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long usrIdx;

	@Column(length = 30, unique = true, nullable = false)
	private String usrEmail;
	
	@Column(nullable = false)
	private String usrPw;

	@Column(nullable = false, length = 30)
	private String usrNick;
}
