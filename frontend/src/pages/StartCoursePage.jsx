import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StartCoursePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'User'}!</h2>
      <p className="mb-4">You are ready to start your course.</p>
      <button
        onClick={() => navigate('/courses')}
        className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
      >
        Start Course
      </button>
    </div>
  );
};

export default StartCoursePage; 