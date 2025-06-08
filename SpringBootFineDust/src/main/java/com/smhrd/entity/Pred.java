package com.smhrd.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
public class Pred {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pmId")
    private int pmId;

    @Column(nullable = false, name = "pmTime")
    private LocalDateTime pmTime;
    
    @Column(name = "pm1")
    private Integer pm1;
    
    @Column(name = "pm25")
    private Integer pm25;

    @Column(name = "pm10")
    private Integer pm10;

    @Column(name = "st_Id")
    private int stId;
}
