import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Google Forms Clone</h1>
      <p className="mb-6">Create and fill forms easily.</p>
      <div className="space-x-4">
        <Link to="/admin" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Admin Dashboard</Link>
        <Link to="/form/sample-form-id" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Fill a Form (Demo)</Link>
      </div>
    </div>
  );
}
