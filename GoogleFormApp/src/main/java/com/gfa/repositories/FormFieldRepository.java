package com.gfa.repositories;

import com.gfa.entities.FormField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormFieldRepository extends JpaRepository<FormField, Long> {
    // Custom query methods can be added here if needed
}
