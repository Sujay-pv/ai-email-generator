package com.spv.genmail;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin("*")
public class EmailGeneratorController {

    private final GenMailService genMailService;
    @PostMapping("/generate")
    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
        String response = genMailService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}
