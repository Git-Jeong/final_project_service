package com.smhrd.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Pred;

public interface PredRepository extends JpaRepository<Pred, Integer> {
	
	Pred findTopByStIdOrderByPmTimeDesc(int stId);

}
