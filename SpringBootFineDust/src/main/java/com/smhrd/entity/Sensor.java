package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer snsrId;

    @Column(nullable = false)
    private LocalDateTime dtime;

    @Column(nullable = false)
    private LocalTime timeHms;

    @Column(nullable = false, length = 10)
    private String weekday;

    private BigDecimal temp;

    private BigDecimal humidity;

    private BigDecimal atmosphericPress;

    private Integer pm1;

    private Integer pm2_5;

    private Integer pm10;

    private BigDecimal coden;

    private BigDecimal co2den;

    @ManyToOne
    @JoinColumn(name = "st_id", nullable = false)
    private Station station;
}
