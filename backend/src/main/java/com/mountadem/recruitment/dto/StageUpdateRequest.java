package com.mountadem.recruitment.dto;

import com.mountadem.recruitment.entity.CandidateStage;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StageUpdateRequest {

    @NotNull
    private CandidateStage stage;
}
