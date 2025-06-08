package com.smhrd.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.EmailAuth;

public interface EmailAuthRepository extends JpaRepository<EmailAuth, String> {
    Optional<EmailAuth> findByUsrEmail(String usrEmail);
}
