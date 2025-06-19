package com.gfa.controllers;

import com.gfa.entities.Form;
import com.gfa.entities.FormResponse;
import com.gfa.entities.ResponseAnswer;
import com.gfa.services.FormService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/forms")
public class FormController {
    private static final Logger log = LoggerFactory.getLogger(FormController.class);
    private final FormService formService;

    @Autowired
    public FormController(FormService formService) {
        this.formService = formService;
    }

    @PostMapping
    public ResponseEntity<Form> createForm(@RequestBody Form form) {
        Form createdForm = formService.createForm(form);
        return ResponseEntity
                .created(URI.create("/api/forms/" + createdForm.getId()))
                .body(createdForm);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Form> getFormById(@PathVariable Long id) {
        return formService.getFormById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/responses")
    public ResponseEntity<?> submitResponse(
            @PathVariable Long id,
            @RequestBody List<String> answers) {
        try {
            if (answers == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Answers list cannot be null"));
            }
            FormResponse response = formService.submitResponse(id, answers);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "An error occurred while processing your request",
                            "details", e.getMessage() != null ? e.getMessage() : "No details available"
                    ));
        }
    }

    @GetMapping("/{id}/responses")
    public ResponseEntity<?> getFormResponses(@PathVariable Long id) {
        try {
            log.info("Fetching responses for form id: {}", id);
            
            // First verify the form exists
            if (id == null || id <= 0) {
                String errorMsg = "Invalid form ID: " + id;
                log.warn(errorMsg);
                return ResponseEntity.badRequest()
                        .body(new HashMap<>().put("error", errorMsg));
            }
            
            if (!formService.existsById(id)) {
                String errorMsg = "Form not found with id: " + id;
                log.warn(errorMsg);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new HashMap<>().put("error", errorMsg));
            }
            
            List<FormResponse> responses = formService.getResponses(id);
            
            if (responses == null || responses.isEmpty()) {
                log.warn("No responses found for form id: {}", id);
                return ResponseEntity.ok(new ArrayList<>());
            }
            
            // Convert responses to a more frontend-friendly format
            List<Map<String, Object>> formattedResponses = new ArrayList<>();
            for (FormResponse response : responses) {
                if (response == null) continue;
                
                try {
                    Map<String, Object> formatted = new HashMap<>();
                    formatted.put("id", response.getId());
                    
                    // Handle potentially null submission date
                    formatted.put("submissionDate", response.getSubmissionDate());
                    
                    // Convert ResponseAnswer objects to answer strings
                    List<String> answerStrings = response.getAnswers().stream()
                        .map(ResponseAnswer::getAnswer)
                        .collect(Collectors.toList());
                    formatted.put("answers", answerStrings);
                    
                    formattedResponses.add(formatted);
                } catch (Exception e) {
                    log.error("Error formatting response: {}", e.getMessage(), e);
                }
            }
                
            log.info("Successfully retrieved {} responses for form id: {}", formattedResponses.size(), id);
            return ResponseEntity.ok(formattedResponses);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new HashMap<>().put("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error fetching responses for form id: " + id, e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "An error occurred while fetching responses");
            errorResponse.put("details", e.getMessage() != null ? e.getMessage() : "No details available");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
