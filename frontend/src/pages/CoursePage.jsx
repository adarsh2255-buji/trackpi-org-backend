import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';

const ASSESSMENT_QUESTIONS = 30;
const ASSESSMENT_TIME = 60; // minutes
const ASSESSMENT_PASS = 25;
const ASSESSMENT_MAX_ATTEMPTS = 5;

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionProgress, setSectionProgress] = useState({}); // sectionId -> progress
  const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
  const [popupSection, setPopupSection] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(ASSESSMENT_MAX_ATTEMPTS);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { progressVersion } = useContext(ProgressContext);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => {
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0]._id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`http://localhost:5000/api/sections/by-course?courseId=${selectedCourse}`)
        .then(res => setSections(res.data))
        .catch(() => setSections([]));
    }
  }, [selectedCourse]);

  useEffect(() => {
    // Fetch progress for each section
    if (sections.length > 0 && token && selectedCourse) {
      const fetchProgress = async () => {
        const progressMap = {};
        await Promise.all(sections.map(async (section) => {
          try {
            const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${section._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            progressMap[section._id] = res.data.sectionProgress;
          } catch {
            progressMap[section._id] = 0;
          }
        }));
        setSectionProgress(progressMap);
      };
      fetchProgress();
    }
  }, [sections, token, selectedCourse, progressVersion]);

  // Fetch attempts left for a section
  const fetchAttemptsLeft = async (sectionId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/progress/section-progress?courseId=${selectedCourse}&sectionId=${sectionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const attempts = res.data.assessment?.attempts || 0;
      setAttemptsLeft(ASSESSMENT_MAX_ATTEMPTS - attempts);
    } catch {
      setAttemptsLeft(ASSESSMENT_MAX_ATTEMPTS);
    }
  };

  const handleAssessmentClick = async (section) => {
    setPopupSection(section);
    await fetchAttemptsLeft(section._id);
    setShowAssessmentPopup(true);
  };

  const handleStartAssessment = () => {
    setShowAssessmentPopup(false);
    if (popupSection) {
      navigate(`/assessment/${selectedCourse}/${popupSection._id}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Courses</h2>
      <div className="flex gap-4 mb-6">
        {courses.map(course => (
          <button
            key={course._id}
            onClick={() => setSelectedCourse(course._id)}
            className={`px-4 py-2 rounded ${selectedCourse === course._id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {course.courseName}
          </button>
        ))}
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Sections</h3>
        {sections.length === 0 ? (
          <div>No sections found for this course.</div>
        ) : (
          <ul className="space-y-2">
            {sections.map(section => (
              <li
                key={section._id}
                className="p-4 bg-white rounded shadow cursor-pointer hover:bg-blue-50"
                onClick={() => navigate(`/courses/${selectedCourse}/sections/${section._id}`)}


              >
                <div className="flex justify-between items-center mb-2">
                  <span>{section.sectionName}</span>
                  <span className="ml-4 text-sm text-gray-500">{sectionProgress[section._id] ?? 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${sectionProgress[section._id] ?? 0}%` }}
                  ></div>
                </div>
                <button
                  className={`mt-2 px-4 py-2 rounded ${sectionProgress[section._id] === 100 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                  disabled={sectionProgress[section._id] !== 100}
                  onClick={e => {
                    e.stopPropagation();
                    handleAssessmentClick(section);
                  }}
                >
                  Assessment
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {showAssessmentPopup && popupSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center space-y-4 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">Section Assessment</h3>
            <div className="text-gray-700 mb-2">Section: <span className="font-bold">{popupSection.sectionName}</span></div>
            <div className="text-gray-700">Number of Questions: <span className="font-bold">{ASSESSMENT_QUESTIONS}</span></div>
            <div className="text-gray-700">Time Allowed: <span className="font-bold">{ASSESSMENT_TIME} minutes</span></div>
            <div className="text-gray-700">Pass Mark: <span className="font-bold">{ASSESSMENT_PASS}</span></div>
            <div className="text-gray-700">Attempts Left: <span className="font-bold">{attemptsLeft}</span></div>
            <div className="flex gap-4 justify-center mt-4">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowAssessmentPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleStartAssessment}
              >
                OK, Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage; 