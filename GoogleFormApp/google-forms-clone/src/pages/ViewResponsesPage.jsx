import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaFileAlt, FaArrowRight } from 'react-icons/fa';
import styles from './ViewResponsesPage.module.css';

export default function ViewResponsesPage() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formIdInput, setFormIdInput] = useState('');
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get responses
        const res = await axios.get(`/api/forms/${id}/responses`);
        setResponses(res.data);
        // Get form fields for headers
        const formRes = await axios.get(`/api/forms/${id}`);
        setFields(formRes.data.fields || []);
      } catch (err) {
        setError('Failed to load responses.');
      } finally {
        setLoading(false);
      }
    };
    fetchResponses();
  }, [id]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formRes = await axios.get(`/api/forms/${id}`);
        setFormTitle(formRes.data.title || `Form #${id}`);
      } catch (err) {
        console.error('Error fetching form data:', err);
      }
    };

    if (id) {
      fetchFormData();
    }
  }, [id]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formIdInput) {
      window.location.href = `/forms/${formIdInput}/responses`;
    }
  };

  if (!id) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>
          <FaFileAlt /> View Form Responses
        </h1>
        <div className={styles.emptyState}>
          <FaSearch size={48} />
          <h3>Enter a Form ID</h3>
          <p>Please enter a form ID to view its responses</p>
          <form onSubmit={handleFormSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={formIdInput}
                onChange={(e) => setFormIdInput(e.target.value)}
                placeholder="Enter Form ID"
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>
                View Responses <FaArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaFileAlt /> Responses: {formTitle || `Form #${id}`}
      </h1>
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading responses...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaFileAlt /> Responses: {formTitle || `Form #${id}`}
      </h1>
      <div className={styles.error}>
        <FaExclamationTriangle />
        <p>{error}</p>
      </div>
    </div>
  );

  // Test if styles are being applied
  console.log('Available styles:', Object.keys(styles));
  
  return (
    <div className={styles.container} style={{ border: '2px solid red' }}>
      <h1 className={styles.title}>
        <FaFileAlt /> Responses: {formTitle || `Form #${id}`}
      </h1>
      {responses.length === 0 ? (
        <div className={styles.emptyState}>
          <FaFileAlt size={48} />
          <h3>No responses yet</h3>
          <p>This form hasn't received any responses yet. Check back later or share the form to collect responses.</p>
        </div>
      ) : (
        <>
          <div className={styles.responseCount}>
            <FaFileAlt /> {responses.length} response{responses.length !== 1 ? 's' : ''} received
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>#</th>
                  {fields.map((field, index) => (
                    <th key={index} className={styles.th}>
                      {field.label || `Question ${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((response, rowIndex) => (
                  <tr key={response.id || rowIndex}>
                    <td className={styles.td}>{rowIndex + 1}</td>
                    {fields.map((field, colIndex) => (
                      <td key={colIndex} className={styles.td}>
                        {response.answers && response.answers[colIndex] !== undefined
                          ? String(response.answers[colIndex])
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
