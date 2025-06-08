package com.smhrd.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smhrd.entity.Pred;

public interface PredRepository extends JpaRepository<Pred, Integer> {
	
	ArrayList<Pred> findTop10ByStIdAndPmTimeLessThanEqualOrderByPmTimeDesc(int stId, LocalDateTime pmTime);

	ArrayList<Pred> findTop10ByStIdAndPmTimeGreaterThanEqualOrderByPmTimeAsc(int stId, LocalDateTime pmTime);

}
