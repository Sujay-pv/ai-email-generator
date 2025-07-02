package com.spv.genmail;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin("*")
public class EmailGeneratorController {

    private final GenMailService genMailService;
//    @PostMapping("/generate")
//    public ResponseEntity<String> generateEmail(@RequestBody EmailRequest emailRequest){
//        String response = genMailService.generateEmailReply(emailRequest);
//        return ResponseEntity.ok(response);
//    }
@PostMapping("/generate")
public ResponseEntity<?> generateEmail(@RequestBody EmailRequest emailRequest) {
    if (emailRequest.getTones() != null && !emailRequest.getTones().isEmpty()) {
        // Multi-tone mode
        List<Map<String, String>> responses = new ArrayList<>();
        for (String tone : emailRequest.getTones()) {
            EmailRequest tempRequest = new EmailRequest();
            tempRequest.setEmailContent(emailRequest.getEmailContent());
            tempRequest.setTone(tone);
            String reply = genMailService.generateEmailReply(tempRequest);

            Map<String, String> entry = new HashMap<>();
            entry.put("tone", tone);
            entry.put("response", reply);
            responses.add(entry);
        }
        return ResponseEntity.ok(responses);
    } else {
        // Single-tone mode
        String response = genMailService.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response);
    }
}

}
