package com.mountadem.recruitment.repository;

import com.mountadem.recruitment.entity.CandidateNote;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateNoteRepository extends JpaRepository<CandidateNote, Long> {
    List<CandidateNote> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);
    Optional<CandidateNote> findByIdAndCandidateId(Long id, Long candidateId);

    @Transactional
    void deleteByCandidateId(Long candidateId);
}
