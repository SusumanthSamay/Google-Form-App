package com.gfa.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "forms")
public class Form {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<FormField> fields = new ArrayList<>();

    // Constructors
    public Form() {}

    public Form(String title) {
        this.title = title;
    }

    // Helper method to add a field and maintain the bidirectional relationship
    public void addField(FormField field) {
        fields.add(field);
        field.setForm(this);
    }

    // Helper method to remove a field
    public void removeField(FormField field) {
        fields.remove(field);
        field.setForm(null);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<FormField> getFields() {
        return fields;
    }

    public void setFields(List<FormField> fields) {
        this.fields = fields;
    }
}
