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
    private int st_id;

    @Column(nullable = false, length = 60)
    private String st_name;

    @Column(nullable = false, length = 300)
    private String st_loc;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal st_lat;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal st_lon;

    @ManyToOne
    @JoinColumn(name = "usr_email", referencedColumnName = "usr_email", nullable = false)
    private User user;
}
