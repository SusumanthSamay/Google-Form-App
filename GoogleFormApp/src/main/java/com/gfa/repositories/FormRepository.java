package com.gfa.repositories;

import com.gfa.entities.Form;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    // Custom query methods can be added here if needed
}
