import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './FillFormPage.module.css';

export default function FillFormPage() {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchForm = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`/api/forms/${id}`);
                setForm(response.data);
                setAnswers(new Array(response.data.fields.length).fill(''));
            } catch (err) {
                setError('Failed to load the form. Please check the link and try again.');
                console.error('Fetch form error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchForm();
    }, [id]);

    const handleInputChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Ensure all required fields are filled
            const requiredFields = form.fields.map((field, index) => ({
                index,
                required: field.isRequired !== false, // Default to true if not specified
                label: field.label || `Question ${index + 1}`
            })).filter(field => field.required);

            const missingFields = requiredFields
                .filter((field) => !answers[field.index]?.toString().trim())
                .map(field => field.label);

            if (missingFields.length > 0) {
                setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
                setLoading(false);
                return;
            }

            // Prepare the answers, ensuring they're strings and not null
            const sanitizedAnswers = answers.map(answer => 
                answer !== null && answer !== undefined ? String(answer) : ''
            );

            // Log the request for debugging
            console.log('Submitting answers:', sanitizedAnswers);

            // Send the answers as a simple array of strings
            const response = await axios.post(
                `/api/forms/${id}/responses`,
                sanitizedAnswers,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    validateStatus: (status) => status < 500 // Don't throw for 4xx errors
                }
            );

            if (response.status === 200) {
                setSuccess('Your response has been submitted successfully!');
                // Clear the form
                setAnswers(new Array(answers.length).fill(''));
            } else {
                // Handle 4xx errors with custom messages
                const errorData = response.data || {};
                const errorMessage = errorData.error || 'Failed to submit form';
                const errorDetails = errorData.details ? `: ${errorData.details}` : '';
                throw new Error(`${errorMessage}${errorDetails}`);
            }
        } catch (err) {
            let errorMessage = 'Failed to submit your response. Please try again.';
            if (err.response) {
                // Server responded with an error status
                if (err.response.status === 404) {
                    errorMessage = 'Form not found. Please check the form link.';
                } else if (err.response.data) {
                    errorMessage = `Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`;
                }
            } else if (err.request) {
                // Request was made but no response received
                errorMessage = 'No response from server. Please check your connection.';
            }
            setError(errorMessage);
            console.error('Submit response error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !form) {
        return <div className={styles.centered}>Loading form...</div>;
    }

    if (error) {
        return <div className={`${styles.centered} ${styles.error}`}>{error}</div>;
    }

    if (success) {
        return <div className={`${styles.centered} ${styles.success}`}>{success}</div>;
    }

    const renderInput = (field, index) => {
        const value = answers[index] || '';

        switch (field.fieldType) {
            case 'long_answer':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={styles.textarea}
                        required
                    />
                );
            case 'yes_no':
                return (
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name={`radio-${field.id}`}
                                value="Yes"
                                checked={value === 'Yes'}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                required
                            /> Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name={`radio-${field.id}`}
                                value="No"
                                checked={value === 'No'}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                            /> No
                        </label>
                    </div>
                );
            case 'date':
            case 'email':
            case 'tel':
            case 'number':
            case 'url':
            case 'short_answer':
            default:
                return (
                    <input
                        type={field.fieldType === 'short_answer' ? 'text' : field.fieldType}
                        value={value}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={styles.input}
                        required={field.required}
                    />
                );
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{form.title}</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                {form.fields.map((field, index) => (
                    <div key={field.id} className={styles.field}>
                        <label className={styles.label}>
                            <span className={styles.questionNumber}>{index + 1}.</span> {field.label}
                            {field.isRequired && <span className={styles.required}> *</span>}
                        </label>
                        {renderInput(field, index)}
                    </div>
                ))}
                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

