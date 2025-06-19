import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CreateFormPage.module.css';
import QuestionItem from '../components/QuestionItem';
import ChooseExistingModal from '../components/ChooseExistingModal';
import LivePreviewPanel from '../components/LivePreviewPanel';
import axios from 'axios';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}


// Component for the Responses tab
function ViewResponsesTab({ styles }) {
  const [formId, setFormId] = useState('');
  const [responses, setResponses] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchResponses = async (id) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResponses([]);
    setFields([]);
    
    try {
      // First, validate the form ID
      if (!id || isNaN(id) || id <= 0) {
        throw new Error('Please enter a valid form ID');
      }

      // Get form fields for headers with better error handling
      const formRes = await axios.get(`/api/forms/${id}`, {
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });

      if (formRes.status === 404) {
        throw new Error('Form not found. Please check the form ID and try again.');
      } else if (formRes.status !== 200) {
        throw new Error(`Failed to load form: ${formRes.status} ${formRes.statusText}`);
      }

      const formData = formRes.data;
      if (!formData.fields || !Array.isArray(formData.fields)) {
        throw new Error('Invalid form data: missing or invalid fields array');
      }

      setFields(formData.fields);
      
      // Get responses with better error handling
      const res = await axios.get(`/api/forms/${id}/responses`, {
        validateStatus: (status) => status < 500 // Don't throw for 4xx errors
      });

      if (res.status === 404) {
        throw new Error('No responses found for this form.');
      } else if (res.status !== 200) {
        throw new Error(`Failed to load responses: ${res.status} ${res.statusText}`);
      }

      if (!Array.isArray(res.data)) {
        throw new Error('Invalid response format from server');
      }

      setResponses(res.data);
    } catch (err) {
      console.error('Error fetching responses:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         'Failed to load responses. Please try again.';
      
      setError(errorMessage);
      setResponses([]);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formId.trim()) {
      setError('Please enter a form ID');
      return;
    }
    fetchResponses(formId);
  };

  return (
    <div className={styles.responsesContainer}>
      <form onSubmit={handleSubmit} className={styles.responsesForm}>
        <div className={styles.formGroup}>
          <input
            type="text"
            value={formId}
            onChange={(e) => setFormId(e.target.value)}
            placeholder="Enter Form ID"
            className={styles.formInput}
          />
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Loading...' : 'View Responses'}
          </button>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </form>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading responses...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <svg className={styles.errorIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
        </div>
      ) : responses.length > 0 ? (
        <div className={styles.tableContainer}>
          <div className={styles.responseCount}>
            Showing {responses.length} response{responses.length !== 1 ? 's' : ''} for form #{formId}
          </div>
          <table className={styles.responsesTable}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeaderCell}>#</th>
                {fields.map((field, index) => (
                  <th key={field.id || index} className={styles.tableHeaderCell}>
                    {field.label || `Question ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {responses.map((response, rowIndex) => (
                <tr key={response.id || rowIndex} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    {rowIndex + 1}
                  </td>
                  {fields.map((field, colIndex) => {
                    const answer = response.answers?.[colIndex];
                    return (
                      <td key={colIndex} className={styles.tableCell}>
                        {answer !== undefined && answer !== null ? String(answer) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : hasSearched ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3>No responses yet</h3>
          <p>This form hasn't received any responses yet.</p>
          <button
            onClick={() => fetchResponses(formId)}
            className={styles.refreshButton}
          >
            <svg className={styles.refreshIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      ) : (
        <div className={styles.noFormState}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3>No form ID entered</h3>
          <p>Enter a form ID to view its responses.</p>
        </div>
      )}
    </div>
  );
}

export default function CreateFormPage() {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formId, setFormId] = useState(null);

  const addQuestion = (q) => {
    setQuestions([
      ...questions,
      q || {
        id: generateId(),
        text: '',
        type: 'short_answer',
        required: false,
      },
    ]);
  };

  // Single handleSubmit function for form creation
  // Single handleSubmit function for form creation
  const handleSubmit = async (e) => {
    console.log('handleSubmit called');
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setFormId(null);
    try {
      // Prepare fields for backend
      const fields = questions.map(q => ({
        label: q.text,
        fieldType: q.type
      }));
      const payload = { title, fields };
      console.log('Submitting payload:', payload);
      const response = await axios.post('/api/forms', payload);
      console.log('Received response:', response.data);
      setSuccess('Form created successfully!');
      setFormId(response.data.id);
      setTitle('');
      setQuestions([]);
    } catch (err) {
      console.error('Form creation error:', err);
      setError(err.response?.data?.message || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };


  // ...rest of the component code



  const updateQuestion = (idx, updated) => {
    setQuestions(questions.map((q, i) => (i === idx ? updated : q)));
  };

  const deleteQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleAddExisting = (selected) => {
    setQuestions([
      ...questions,
      ...selected.map(q => ({ ...q, id: generateId() })),
    ]);
  };



  const [activeTab, setActiveTab] = useState('create');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Google Forms Clone</h1>
        </div>
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="text-green-700">
              {success}<br />
              {formId && (
                <div className="mt-2">
                  <span className="font-medium">Shareable Link: </span>
                  <a 
                    className="text-blue-600 hover:underline break-all" 
                    href={`http://localhost:5173/form/${formId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    http://localhost:5173/form/{formId}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              onClick={() => setActiveTab('create')}
              className={`${styles.tab} ${activeTab === 'create' ? styles.tabActive : ''}`}
            >
              Create Form
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`${styles.tab} ${activeTab === 'responses' ? styles.tabActive : ''}`}
            >
              View Responses
            </button>
            <div 
              className={styles.tabIndicator}
              style={{
                width: activeTab === 'create' ? '100px' : '110px',
                left: activeTab === 'create' ? '0.25rem' : 'calc(100px + 0.5rem)'
              }}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {activeTab === 'create' ? (
            <div className={styles.layout}>
              {/* Left: Form Builder */}
              <div className={styles.formBuilder}>
                <h2 className={styles.formTitle}>Create a New Form</h2>
                <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Form Title</label>
                    <input
                      className={styles.inputTitle}
                      placeholder="Enter form title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className={styles.questionsHeader}>
                      <h3 className={styles.questionsTitle}>Questions</h3>
                      <span className={styles.questionsCount}>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
                    </div>
                    
                    {questions.length === 0 ? (
                      <div className={styles.emptyState}>
                        <p className={styles.emptyText}>No questions yet. Add your first question below.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((q, idx) => (
                          <QuestionItem
                            key={q.id}
                            question={q}
                            onChange={updated => updateQuestion(idx, updated)}
                            onDelete={() => deleteQuestion(idx)}
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className={styles.buttonRow}>
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => addQuestion()}
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Question
                      </button>
                      <button
                        type="button"
                        className={styles.chooseButton}
                        onClick={() => setShowModal(true)}
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                        </svg>
                        Choose from existing
                      </button>
                    </div>
                    
                    {error && (
                      <div className={styles.errorBox}>
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className={styles.errorIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className={styles.errorText}>{error}</h3>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.submitSection}>
                      <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading || !title || questions.length === 0}
                      >
                        {loading ? (
                          <>
                            <svg className={styles.loadingIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Submit Form'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
                <ChooseExistingModal
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  onAdd={handleAddExisting}
                />
              </div>
              {/* Right: Live Preview */}
              <div className={styles.previewCol}>
                <div className={styles.stickyPreview}>
                  <LivePreviewPanel title={title} questions={questions} />
                </div>
              </div>
            </div>
          ) : (
            <ViewResponsesTab styles={styles} />
          )}
        </div>
      </div>
    </div>
  );
}