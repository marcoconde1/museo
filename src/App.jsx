import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Galeria from './components/Galeria';
import ObjetoPage from './components/ObjetoPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Galeria />} />
        <Route path="/objeto/:id" element={<ObjetoPage />} />
      </Routes>
    </Router>
  );
};

export default App;
