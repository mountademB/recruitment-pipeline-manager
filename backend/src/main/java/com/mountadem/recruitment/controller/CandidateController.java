package com.mountadem.recruitment.controller;

import com.mountadem.recruitment.dto.StageUpdateRequest;
import com.mountadem.recruitment.entity.Candidate;
import com.mountadem.recruitment.entity.CandidateStage;
import com.mountadem.recruitment.exception.CandidateNotFoundException;
import com.mountadem.recruitment.repository.CandidateRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateRepository candidateRepository;

    public CandidateController(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @GetMapping
    public List<Candidate> getAllCandidates(
            @RequestParam(required = false) CandidateStage stage,
            @RequestParam(required = false) String search
    ) {
        return candidateRepository.searchCandidates(stage, search);
    }

    @GetMapping("/{id}")
    public Candidate getCandidateById(@PathVariable Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Candidate createCandidate(@Valid @RequestBody Candidate candidate) {
        if (candidate.getStage() == null) {
            candidate.setStage(CandidateStage.APPLIED);
        }
        return candidateRepository.save(candidate);
    }

    @PutMapping("/{id}")
    public Candidate updateCandidate(@PathVariable Long id, @Valid @RequestBody Candidate updatedCandidate) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(id));

        existingCandidate.setFirstName(updatedCandidate.getFirstName());
        existingCandidate.setLastName(updatedCandidate.getLastName());
        existingCandidate.setEmail(updatedCandidate.getEmail());
        existingCandidate.setPhone(updatedCandidate.getPhone());
        existingCandidate.setPosition(updatedCandidate.getPosition());
        existingCandidate.setStage(updatedCandidate.getStage());

        return candidateRepository.save(existingCandidate);
    }

    @PutMapping("/{id}/stage")
    public Candidate updateCandidateStage(@PathVariable Long id, @Valid @RequestBody StageUpdateRequest request) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(id));

        candidate.setStage(request.getStage());
        return candidateRepository.save(candidate);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCandidate(@PathVariable Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new CandidateNotFoundException(id));

        candidateRepository.delete(candidate);
    }
}
