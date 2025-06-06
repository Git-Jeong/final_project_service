package com.smhrd.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.smhrd.entity.EmailAuth;
import com.smhrd.repository.EmailAuthRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailAuthService {

    private final MailService mailService;
    private final EmailAuthRepository emailAuthRepository;

    public void sendVerificationCode(String usrEmail) {
        String code = generateCode();
        mailService.sendEmail(usrEmail, "이메일 인증 코드", "인증코드: " + code);

		EmailAuth auth = emailAuthRepository.findByUsrEmail(usrEmail)
		    .orElse(new EmailAuth(usrEmail, null, null, null));
        auth.setCode(code);
        auth.setCreatedAt(LocalDateTime.now());
        auth.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        emailAuthRepository.save(auth);
    }

    public boolean verifyCode(String usrEmail, String code) {
        return emailAuthRepository.findByUsrEmail(usrEmail)
            .filter(auth -> auth.getCode().equals(code))
            .filter(auth -> auth.getExpiresAt().plusMinutes(0).isAfter(LocalDateTime.now()))
            .isPresent();
    }

    private String generateCode() {
        return String.valueOf((int)(Math.random() * 900000 + 100000));
    }
}
