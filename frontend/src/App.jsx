import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import HomePage from './pages/HomePage';
import OAuthRedirectHandler from './pages/OAuthRedirectHandler';
import PhoneNumberPage from './pages/PhoneNumberPage';
import StartCoursePage from './pages/StartCoursePage';
import CoursePage from './pages/CoursePage';
import SectionPage from './pages/SectionPage';

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/phone-number" element={<OAuthRedirectHandler />} />
            <Route path="/start-course" element={<OAuthRedirectHandler />} />
            <Route path="/phone-number/enter" element={<PhoneNumberPage />} />
            <Route path="/start-course/dashboard" element={<StartCoursePage />} />
            <Route path="/courses" element={<CoursePage />} />
            <Route path="/courses/:courseId/sections/:sectionId" element={<SectionPage />} />
          </Routes>
        </Router>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;
