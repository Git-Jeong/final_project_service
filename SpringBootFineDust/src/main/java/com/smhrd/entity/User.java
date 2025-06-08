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
    @Column(name = "usr_idx")
	private Long usrIdx;

	@Column(length = 30, unique = true, nullable = false, name = "usr_email")
	private String usrEmail;
	
	@Column(nullable = false, name = "usr_pw")
	private String usrPw;

	@Column(nullable = false, length = 30, name = "usr_nick")
	private String usrNick;
}
