package com.gfa.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "response_answers")
public class ResponseAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "answer", length = 1000)
    private String answer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "response_id", nullable = false)
    private FormResponse response;

    public ResponseAnswer() {}

    public ResponseAnswer(String answer, FormResponse response) {
        this.answer = answer;
        this.response = response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public FormResponse getResponse() {
        return response;
    }

    public void setResponse(FormResponse response) {
        this.response = response;
    }
}
