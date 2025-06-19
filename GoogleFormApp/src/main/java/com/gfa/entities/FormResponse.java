package com.gfa.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "form_responses")
public class FormResponse {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    @Column(name = "submission_date", updatable = false)
    private LocalDateTime submissionDate = LocalDateTime.now();

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseAnswer> answers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) {
            this.submissionDate = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }
    
    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    // Constructors
    public FormResponse() {}

    public FormResponse(Form form) {
        this.form = form;
    }

    public FormResponse(Form form, List<String> answers) {
        this.form = form;
        if (answers != null) {
            for (String ans : answers) {
                this.addAnswer(new ResponseAnswer(ans, this));
            }
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Form getForm() {
        return form;
    }

    public void setForm(Form form) {
        this.form = form;
    }

    public List<ResponseAnswer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<ResponseAnswer> answers) {
        this.answers = answers != null ? new ArrayList<>(answers) : new ArrayList<>();
    }

    // Helper method to add an answer
    public void addAnswer(ResponseAnswer answer) {
        if (answer != null) {
            answer.setResponse(this);
            this.answers.add(answer);
        }
    }
}
