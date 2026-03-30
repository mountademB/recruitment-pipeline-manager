package com.mountadem.recruitment.controller;

import com.mountadem.recruitment.entity.CandidateStage;
import com.mountadem.recruitment.repository.CandidateRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final CandidateRepository candidateRepository;

    public DashboardController(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    @GetMapping("/summary")
    public Map<String, Long> getSummary() {
        Map<String, Long> summary = new LinkedHashMap<>();
        summary.put("totalCandidates", candidateRepository.count());
        summary.put("applied", candidateRepository.countByStage(CandidateStage.APPLIED));
        summary.put("screened", candidateRepository.countByStage(CandidateStage.SCREENED));
        summary.put("interview", candidateRepository.countByStage(CandidateStage.INTERVIEW));
        summary.put("accepted", candidateRepository.countByStage(CandidateStage.ACCEPTED));
        summary.put("rejected", candidateRepository.countByStage(CandidateStage.REJECTED));
        return summary;
    }
}
