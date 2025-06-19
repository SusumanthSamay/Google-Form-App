import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <Link to="/admin/create" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create New Form</Link>
      {/* Future: List forms here */}
    </div>
  );
}
