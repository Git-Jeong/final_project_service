package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer noti_id;                        // 알림 고유 ID

    @Column(nullable = false, length = 255)
    private String usr_email;                       // 사용자 이메일

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('error', 'info', 'warning') DEFAULT 'info'")
    private NotiType noti_type = NotiType.info;    // 알림 종류

    @Column(nullable = false, length = 255)
    private String noti_title;                      // 알림 제목
    
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime noti_time;			// 발생 시간

    @Column(nullable = false, columnDefinition = "TEXT")
    private String noti_content;                    // 알림 내용

    @Column(length = 100)
    private String noti_state = "대기중";           // 상태

    @Column(nullable = false)
    private Boolean is_read = false;                 // 읽음 여부

    public enum NotiType {
        error,
        info,
        warning
    }
}
