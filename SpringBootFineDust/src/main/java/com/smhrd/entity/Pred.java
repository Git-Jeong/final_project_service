package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "pred")
public class Pred {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pm_id")
    private int pmId;

    @Column(nullable = false, name = "pm_time")
    private LocalDateTime pmTime;

    @Column(name = "time_hms")
    private LocalTime timeHms;
    
    @Column(name = "pm1")
    private Integer pm1;
    
    @Column(name = "pm25")
    private Integer pm25;

    @Column(name = "pm10")
    private Integer pm10;

    @Column(name = "st_id")
    private int stId;
}
