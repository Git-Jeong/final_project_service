package com.smhrd.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Pred;

public interface PredRepository extends JpaRepository<Pred, Integer> {

	List<Pred> findByStIdAndPmTimeAfterOrderByPmTimeDesc(int stId, LocalDateTime timeThreshold);

}
