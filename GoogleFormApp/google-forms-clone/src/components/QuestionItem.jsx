import React from 'react';
import styles from './QuestionItem.module.css';

const QUESTION_TYPES = [
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'long_answer', label: 'Long Answer' },
  { value: 'number', label: 'Number' },
  { value: 'yes_no', label: 'Yes/No' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone Number' },
  { value: 'url', label: 'URL' },
];

export default function QuestionItem({ question, onChange, onDelete }) {
  return (
    <div className={styles.card}>
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              className={styles.input}
              type="text"
              placeholder="Enter your question here"
              value={question.text}
              onChange={e => onChange({ ...question, text: e.target.value })}
            />
            <button
              type="button"
              onClick={onDelete}
              className={styles.deleteButton}
              aria-label="Delete question"
              title="Delete question"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <select
              className={styles.select}
              value={question.type}
              onChange={e => onChange({ ...question, type: e.target.value })}
            >
              {QUESTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={question.required}
                onChange={e => onChange({ ...question, required: e.target.checked })}
              />
              <span className={styles.requiredLabel}>Required</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}