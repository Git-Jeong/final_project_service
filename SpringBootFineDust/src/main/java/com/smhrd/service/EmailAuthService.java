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
        String htmlContent = String.format(
        	    "<html><body style='margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;'>"
        	    + "<table align='center' width='100%%' style='max-width:600px;'>"
        	    + "<tr><td align='center' style='padding-bottom: 20px;'>"
        	    + "<h2 style='color:#2c3e50;'>이메일 인증 코드</h2>"
        	    + "</td></tr>"
        	    + "<tr><td style='font-size:16px; color:#333;'>"
        	    + "<p>안녕하세요,</p>"
        	    + "<p>아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요.</p>"
        	    + "<div style='text-align:center; margin:30px 0;'>"
        	    + "<span style='display:inline-block; background-color:#2c3e50; color:#ffffff; padding:15px 30px; font-size:28px; font-weight:bold; letter-spacing:5px; border-radius:6px;'>%s</span>"
        	    + "</div>"
        	    + "<p>이 코드는 <strong>5분간</strong> 유효합니다.</p>"
        	    + "<p style='color:#7f8c8d; font-size:14px;'>※ 본 메일을 요청하지 않으셨다면, 이 메일은 무시하셔도 됩니다.</p>"
        	    + "<p style='margin-top:40px;'>감사합니다.</p>"
        	    + "</td></tr>"
        	    + "</table>"
        	    + "</body></html>",
        	    code
        	);
        
        mailService.sendEmail(
    	    usrEmail,
    	    "이메일 인증 코드",
    	    htmlContent
    	);

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
