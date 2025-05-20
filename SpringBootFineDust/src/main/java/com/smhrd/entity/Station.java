package com.smhrd.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import lombok.Data;

@Data
@Entity
public class Station {

    @Id
    private int stId;

    @Column(nullable = false, length = 60)
    private String stName;

    @Column(nullable = false, length = 300)
    private String stLoc;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal stLat;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal stLon;

    @ManyToOne
    @JoinColumn(name = "usrEmail", referencedColumnName = "usrEmail", nullable = false)
    private User user;
}
