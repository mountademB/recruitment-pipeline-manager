package com.mountadem.recruitment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateNoteRequest {

    @NotBlank
    private String content;

    @NotBlank
    private String author;
}
