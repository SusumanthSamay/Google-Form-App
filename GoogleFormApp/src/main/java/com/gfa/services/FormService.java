package com.gfa.services;

import com.gfa.entities.Form;
import com.gfa.entities.FormField;
import com.gfa.entities.FormResponse;
import com.gfa.entities.ResponseAnswer;
import com.gfa.repositories.FormRepository;
import com.gfa.repositories.FormResponseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Optional;

@Service
public class FormService {

    private static final Logger logger = LoggerFactory.getLogger(FormService.class);

    private final FormRepository formRepository;
    private final FormResponseRepository formResponseRepository;

    @Autowired
    public FormService(FormRepository formRepository, FormResponseRepository formResponseRepository) {
        this.formRepository = formRepository;
        this.formResponseRepository = formResponseRepository;
    }

    @Transactional
    public Form createForm(Form form) {
        if (form == null) {
            throw new IllegalArgumentException("Form cannot be null");
        }

        logger.info("Creating new form with title: {}", form.getTitle());

        // Establish the bidirectional relationship before saving
        if (form.getFields() != null) {
            for (FormField field : form.getFields()) {
                field.setForm(form);
            }
        }

        // Save the form, which cascades to the fields
        Form savedForm = formRepository.save(form);

        logger.info("Successfully created form with id: {}", savedForm.getId());
        return savedForm;
    }

    public Optional<Form> getFormById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid form ID: " + id);
        }
        logger.debug("Fetching form with id: {}", id);
        return formRepository.findById(id);
    }

    @Transactional
    public FormResponse submitResponse(Long formId, List<String> answers) {
        logger.info("Starting to process response submission for form id: {}", formId);
        
        if (formId == null || formId <= 0) {
            String errorMsg = "Invalid form ID: " + formId;
            logger.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }
        
        if (answers == null) {
            String errorMsg = "Answers list cannot be null";
            logger.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }

        logger.debug("Looking up form with id: {}", formId);
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> {
                    String errorMsg = "Form not found with id: " + formId;
                    logger.warn(errorMsg);
                    return new EntityNotFoundException(errorMsg);
                });

        logger.debug("Form found with title: {}", form.getTitle());
        
        // Validate number of answers matches number of fields
        if (form.getFields() != null && form.getFields().size() != answers.size()) {
            String errorMsg = String.format(
                "Number of answers (%d) does not match number of form fields (%d)",
                answers.size(),
                form.getFields().size()
            );
            logger.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }

        try {
            logger.debug("Creating new FormResponse");
            FormResponse response = new FormResponse();
            response.setForm(form);
            for (String ans : answers) {
                ResponseAnswer answer = new ResponseAnswer();
                answer.setAnswer(ans);
                response.addAnswer(answer);
            }
            logger.debug("Saving FormResponse to database");
            FormResponse savedResponse = formResponseRepository.save(response);
            logger.info("Successfully saved response with id: {} for form id: {}",
                    savedResponse.getId(), formId);
            return savedResponse;
        } catch (Exception e) {
            logger.error("Error saving form response: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save form response: " + e.getMessage(), e);
        }
    }

    public boolean existsById(Long formId) {
        if (formId == null || formId <= 0) {
            return false;
        }
        return formRepository.existsById(formId);
    }

    public List<FormResponse> getResponses(Long formId) {
        logger.info("Fetching responses for form id: {}", formId);
        
        if (formId == null || formId <= 0) {
            String errorMsg = "Invalid form ID: " + formId;
            logger.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }
        
        try {
            // Get the form to ensure it exists and has fields
            Form form = formRepository.findById(formId)
                .orElseThrow(() -> {
                    String errorMsg = "Form not found with id: " + formId;
                    logger.warn(errorMsg);
                    return new EntityNotFoundException(errorMsg);
                });
                
            logger.debug("Found form with id: {}, title: {}", formId, form.getTitle());
            
            // Get all responses for this form
            List<FormResponse> responses = formResponseRepository.findByFormId(formId);
            logger.info("Found {} responses for form id: {}", responses.size(), formId);
            
            // Ensure all responses have the same number of answers as form fields
            if (form.getFields() != null) {
                int expectedAnswerCount = form.getFields().size();
                responses.forEach(response -> {
                    if (response.getAnswers() != null && response.getAnswers().size() != expectedAnswerCount) {
                        logger.warn("Response {} has {} answers, expected {}", 
                            response.getId(), response.getAnswers().size(), expectedAnswerCount);
                    }
                });
            }
            
            return responses;
            
        } catch (Exception e) {
            logger.error("Error fetching responses for form id: " + formId, e);
            throw new RuntimeException("Failed to fetch responses: " + e.getMessage(), e);
        }
    }
}
