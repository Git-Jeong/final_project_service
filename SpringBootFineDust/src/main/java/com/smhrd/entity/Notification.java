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
    private LocalDateTime noti_time;                // 발생 시간 (DB 서버 타임존이 Asia/Seoul이어야 한국시간 적용)

    @Column(nullable = false, columnDefinition = "TEXT")
    private String noti_content_1;                    // 알림 내용

    @Column(nullable = false, columnDefinition = "TEXT")
    private String noti_content_2;                    // 알림 내용
    
    @Column(nullable = false, columnDefinition = "INT NOT NULL DEFAULT 0 CHECK (is_read IN (0,1))")
    private int is_read = 0;                         // 읽음 여부 (0 또는 1, 기본값 0)

    public enum NotiType {
        error,
        info,
        warning
    }
    
    @PrePersist
    public void prePersist() {
        if (noti_time == null) {
            noti_time = LocalDateTime.now();
        }
    }
}
