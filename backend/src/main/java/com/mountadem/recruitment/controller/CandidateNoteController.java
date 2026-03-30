package com.mountadem.recruitment.controller;

import com.mountadem.recruitment.dto.CandidateNoteRequest;
import com.mountadem.recruitment.entity.Candidate;
import com.mountadem.recruitment.entity.CandidateNote;
import com.mountadem.recruitment.exception.CandidateNotFoundException;
import com.mountadem.recruitment.repository.CandidateNoteRepository;
import com.mountadem.recruitment.repository.CandidateRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/candidates/{candidateId}/notes")
public class CandidateNoteController {

    private final CandidateRepository candidateRepository;
    private final CandidateNoteRepository candidateNoteRepository;

    public CandidateNoteController(CandidateRepository candidateRepository, CandidateNoteRepository candidateNoteRepository) {
        this.candidateRepository = candidateRepository;
        this.candidateNoteRepository = candidateNoteRepository;
    }

    @GetMapping
    public List<CandidateNote> getNotesByCandidateId(@PathVariable Long candidateId) {
        if (!candidateRepository.existsById(candidateId)) {
            throw new CandidateNotFoundException(candidateId);
        }
        return candidateNoteRepository.findByCandidateIdOrderByCreatedAtDesc(candidateId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CandidateNote addNote(@PathVariable Long candidateId, @Valid @RequestBody CandidateNoteRequest request) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new CandidateNotFoundException(candidateId));

        CandidateNote note = new CandidateNote();
        note.setContent(request.getContent());
        note.setAuthor(request.getAuthor());
        note.setCandidate(candidate);

        return candidateNoteRepository.save(note);
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNote(@PathVariable Long candidateId, @PathVariable Long noteId) {
        if (!candidateRepository.existsById(candidateId)) {
            throw new CandidateNotFoundException(candidateId);
        }

        CandidateNote note = candidateNoteRepository.findByIdAndCandidateId(noteId, candidateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Note not found with id: " + noteId + " for candidate id: " + candidateId
                ));

        candidateNoteRepository.delete(note);
    }
}
