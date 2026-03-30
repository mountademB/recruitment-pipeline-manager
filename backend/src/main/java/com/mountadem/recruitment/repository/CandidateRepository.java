package com.mountadem.recruitment.repository;

import com.mountadem.recruitment.entity.Candidate;
import com.mountadem.recruitment.entity.CandidateStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByStage(CandidateStage stage);
    long countByStage(CandidateStage stage);

    @Query("""
        SELECT c
        FROM Candidate c
        WHERE (:stage IS NULL OR c.stage = :stage)
          AND (
            :search IS NULL OR :search = '' OR
            LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE LOWER(CONCAT('%', :search, '%'))
          )
        ORDER BY c.id DESC
    """)
    List<Candidate> searchCandidates(@Param("stage") CandidateStage stage, @Param("search") String search);
}
