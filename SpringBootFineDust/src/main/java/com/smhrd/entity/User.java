package com.smhrd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class User {

	@Id
	@Column(length = 30)
	private String usrEmail;
	
	@Column(nullable = false, length = 20)
	private String usrPw;

	@Column(nullable = false, length = 30)
	private String usrNick;
}
