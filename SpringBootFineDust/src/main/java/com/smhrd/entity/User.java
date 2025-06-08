package com.smhrd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usrIdx")
	private Long usrIdx;

	@Column(length = 30, unique = true, nullable = false, name = "usrEmail")
	private String usrEmail;
	
	@Column(nullable = false, name = "usrPw")
	private String usrPw;

	@Column(nullable = false, length = 30, name = "usrNick")
	private String usrNick;
}
