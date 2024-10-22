import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Map from './Map';
import RatingAndPhotoUpload from './RatingAndPhotoUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/upload" element={<RatingAndPhotoUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
