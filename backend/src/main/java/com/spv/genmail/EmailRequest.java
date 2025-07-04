package com.spv.genmail;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
public class EmailRequest {
    private String emailContent;
    private String tone;
    private List<String> tones;
}
