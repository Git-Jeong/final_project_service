package com.smhrd.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Station {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int stId;

    @Column(nullable = false, length = 60)
    private String stName_1;

    @Column(nullable = true, length = 60)
    private String stName_2;
    
    @Column(nullable = true, length = 60)
    private String stName_3;

    @Column(nullable = false, length = 100)
    private String usrEmail;
}
