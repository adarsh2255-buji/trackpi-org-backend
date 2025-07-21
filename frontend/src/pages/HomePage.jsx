import React from 'react';

const HomePage = () => {
  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Learning Platform</h1>
      <button
        onClick={handleGoogleSignup}
        className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
      >
        Sign up with Google
      </button>
    </div>
  );
};

export default HomePage; 