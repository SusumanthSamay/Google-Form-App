import React from 'react';
import styles from './ChooseExistingModal.module.css';

const existingQuestions = [
  // Personal Information
  { id: 'full_name', text: 'Full Name', type: 'short_answer' },
  { id: 'email', text: 'Email Address', type: 'email' },
  { id: 'phone', text: 'Phone Number', type: 'tel' },
  { id: 'dob', text: 'Date of Birth', type: 'date' },
  { id: 'address', text: 'Current Address', type: 'long_answer' },
  
  // Education
  { id: 'college', text: 'College/University Name', type: 'short_answer' },
  { id: 'grad_year', text: 'Graduation Year', type: 'number' },
  
  // Professional Links
  { id: 'linkedin', text: 'LinkedIn Profile URL', type: 'url' },
  { id: 'portfolio', text: 'Portfolio/Website URL', type: 'url' },
  
  // Yes/No Questions
  { id: 'sales_exp', text: 'Have you worked in sales or marketing roles before, either through internships or part-time positions?', type: 'yes_no' },
  { id: 'b2b_exp', text: 'Have you had any previous experience working with a B2B organization?', type: 'yes_no' },
  
  // Other
  { id: 'referral', text: 'How did you hear about us?', type: 'short_answer' },
];

export default function ChooseExistingModal({ open, onClose, onAdd }) {
  const [selected, setSelected] = React.useState([]);

  React.useEffect(() => {
    if (!open) setSelected([]);
  }, [open]);

  const toggle = id => {
    setSelected(sel =>
      sel.includes(id) ? sel.filter(sid => sid !== id) : [...sel, id]
    );
  };

  const handleAdd = () => {
    const questions = existingQuestions.filter(q => selected.includes(q.id));
    onAdd(questions);
    onClose();
  };

  if (!open) return null;
  
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Choose from existing questions</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.questionsList}>
          {existingQuestions.map(q => (
            <div 
              key={q.id} 
              className={styles.questionItem}
              onClick={() => toggle(q.id)}
            >
              <input
                type="checkbox"
                className={styles.questionCheckbox}
                checked={selected.includes(q.id)}
                onChange={() => {}}
              />
              <span className={styles.questionText}>{q.text}</span>
              <span className={styles.questionType}>
                {q.type.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.addButton} 
            onClick={handleAdd} 
            disabled={selected.length === 0}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add {selected.length > 0 ? `${selected.length} ` : ''}question{selected.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
