package com.smhrd.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

	User findByUsrEmailAndUsrPw(String usrEmail, String usrPw);

	Optional<User> findByUsrEmail(String usrEmail);

	User findByUsrEmailAndUsrNick(String usrEmail, String usrNick);
}
