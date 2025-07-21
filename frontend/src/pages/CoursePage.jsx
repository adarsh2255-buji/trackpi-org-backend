import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all courses
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
      // Fetch sections for the selected course
      axios.get(`http://localhost:5000/api/sections/by-course?courseId=${selectedCourse}`)
        .then(res => setSections(res.data))
        .catch(() => setSections([]));
    }
  }, [selectedCourse]);

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
                {section.sectionName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CoursePage; 