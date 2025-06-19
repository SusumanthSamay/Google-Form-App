import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CreateFormPage from './pages/CreateFormPage';
import FillFormPage from './pages/FillFormPage';
import ViewResponsesPage from './pages/ViewResponsesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<CreateFormPage />} />
          <Route path="/form/:id" element={<FillFormPage />} />
          <Route path="/responses/:id" element={<ViewResponsesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
