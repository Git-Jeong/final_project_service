package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "sensor")
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "snsrId")
    private int snsrId;

    @Column(nullable = false)
    private LocalDateTime dtime;

    @Column(nullable = false)
    private LocalTime timeHms;

    @Column(nullable = false, length = 10)
    private String weekday;

    private BigDecimal temp;

    private BigDecimal humidity;
    
    private BigDecimal atmosphericPress;

    @Column(name = "pm1")
    private Integer pm1;
    
    @Column(name = "pm25")
    private Integer pm25;

    @Column(name = "pm10")
    private Integer pm10;

    @Column(name = "coden")
    private BigDecimal coden;

    @Column(name = "co2den")
    private BigDecimal co2den;

    @Column(name = "st_id")
    private int stId;
}
