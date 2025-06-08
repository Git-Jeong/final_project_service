package com.smhrd.controller;

import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.smhrd.entity.User;
import com.smhrd.service.EmailService;
import com.smhrd.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class EmailController {

    @Autowired
    private final EmailService emailService;

    @Autowired
    private UserService userService;
    
    // email 유효시간 300초
    private int codeValidSeconds = 300;
    
    @PostMapping("/new-send-code")
    public ResponseEntity<?> newUserCode(@RequestBody Map<String, String> requestBody) {
        String usrEmail = requestBody.get("usrEmail");
        User usr = userService.findByUsrEmailForLogin(usrEmail);

        if ((usr != null) && (usr.getUsrEmail() != null)) {
            return ResponseEntity.ok(Map.of("status", "fail", "message", "이미 있는 계정입니다."));
        }
        emailService.sendVerificationCode(usrEmail);
        // 명시적으로 성공 메시지 전달
        return ResponseEntity.ok(Map.of("status", "success", "message", "인증코드 전송됨", "codeValidSeconds", codeValidSeconds));
    }
    
    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> requestBody) {
        String usrEmail = requestBody.get("usrEmail");
        User usr = userService.findByUsrEmailForLogin(usrEmail);
        if ((usr != null) && (usr.getUsrEmail() != null)) {
            emailService.sendVerificationCode(usrEmail);
            // 명시적으로 성공 메시지 전달
            return ResponseEntity.ok(Map.of("status", "success", "message", "인증코드 전송됨", "codeValidSeconds", codeValidSeconds));
        } else {
            // 이메일이 존재하지 않음 → 200 OK + 실패 상태 전달
            return ResponseEntity.ok(Map.of("status", "fail", "message", "일치하는 회원이 없습니다."));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String usrEmail, @RequestParam String code) {
        boolean isValid = emailService.verifyCode(usrEmail, code);
        if (isValid) {
            return ResponseEntity.ok("인증 성공");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 실패");
    }
}