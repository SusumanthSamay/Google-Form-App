CREATE TABLE IF NOT EXISTS forms (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS form_fields (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    label VARCHAR(255) NOT NULL,
    field_type VARCHAR(255) NOT NULL,
    form_id BIGINT NOT NULL,
    CONSTRAINT fk_form_field_form FOREIGN KEY (form_id) REFERENCES forms(id)
);

CREATE TABLE IF NOT EXISTS form_responses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    form_id BIGINT NOT NULL,
    submission_date DATETIME,
    CONSTRAINT fk_response_form FOREIGN KEY (form_id) REFERENCES forms(id)
);

CREATE TABLE IF NOT EXISTS response_answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    answer VARCHAR(1000),
    response_id BIGINT NOT NULL,
    CONSTRAINT fk_answer_response FOREIGN KEY (response_id) REFERENCES form_responses(id)
);
