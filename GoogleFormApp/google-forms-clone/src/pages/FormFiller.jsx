import React from 'react';
import { useParams } from 'react-router-dom';

export default function FormFiller() {
  const { formId } = useParams();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Fill Form</h2>
      <p>Form ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{formId}</span></p>
      <p>Form filling UI will go here.</p>
    </div>
  );
}
