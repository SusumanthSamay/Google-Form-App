import React from 'react';
import styles from './LivePreviewPanel.module.css';

function getPreviewInput(type, required) {
  switch (type) {
    case 'short_answer':
      return <input type="text" className={styles.input} placeholder="Short answer" disabled />;
    case 'long_answer':
      return <textarea className={styles.textarea} placeholder="Long answer" disabled rows={2}></textarea>;
    case 'number':
      return <input type="number" className={styles.input} placeholder="Number" disabled />;
    case 'yes_no':
      return (
        <div className="flex gap-4">
          <label className={styles.radioLabel}><input type="radio" disabled className={styles.radio} /> Yes</label>
          <label className={styles.radioLabel}><input type="radio" disabled className={styles.radio} /> No</label>
        </div>
      );
    case 'single_choice':
      return (
        <div className="flex gap-4">
          <label className={styles.radioLabel}><input type="radio" disabled className={styles.radio} /> Option 1</label>
          <label className={styles.radioLabel}><input type="radio" disabled className={styles.radio} /> Option 2</label>
        </div>
      );
    case 'multiple_choice':
      return (
        <div className="flex gap-4">
          <label className={styles.checkboxLabel}><input type="checkbox" disabled className={styles.checkbox} /> Option 1</label>
          <label className={styles.checkboxLabel}><input type="checkbox" disabled className={styles.checkbox} /> Option 2</label>
        </div>
      );
    case 'date':
      return <input type="date" className={styles.input} disabled />;
    default:
      return null;
  }
}

export default function LivePreviewPanel({ title, questions }) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Live Preview</h2>
      <div className={styles.panelContent}>
        {questions.length === 0 ? (
          <div className={styles.emptyState}>
            Your form preview will appear here as you add questions.
          </div>
        ) : (
          <div className={styles.spaceY4}>
            <div className={styles.borderBottom}>
              <h3 className={styles.title}>{title || 'Untitled Form'}</h3>
              <p className={styles.description}>Form description</p>
            </div>
            {questions.map((q, idx) => (
              <div key={q.id} className={styles.questionCard}>
                <div className={styles.flexItemsStart}>
                  <span className={styles.fontMedium}>{idx + 1}.</span>
                  <div className={styles.flex1}>
                    <div className={styles.flexItemsCenter}>
                      <span className={styles.fontMedium}>
                        {q.text || <span className={styles.italicTextGray400}>Untitled Question</span>}
                      </span>
                      {q.required && <span className="ml-1 text-red-500">*</span>}
                    </div>
                    <div className="mt-2">
                      {getPreviewInput(q.type, q.required)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}