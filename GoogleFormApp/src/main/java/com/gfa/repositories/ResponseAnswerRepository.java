package com.gfa.repositories;

import com.gfa.entities.ResponseAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResponseAnswerRepository extends JpaRepository<ResponseAnswer, Long> {
}
