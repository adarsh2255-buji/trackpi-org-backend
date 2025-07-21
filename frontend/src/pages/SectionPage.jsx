import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SectionPage = () => {
  const { courseId, sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/sections/${sectionId}`)
      .then(res => {
        setSection(res.data);
        if (res.data.units && res.data.units.length > 0) {
          setVideos(res.data.units);
        } else {
          setVideos([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sectionId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Section: {section?.sectionName}</h2>
      <h3 className="text-xl font-semibold mb-4">Videos</h3>
      {videos.length === 0 ? (
        <div>No videos found for this section.</div>
      ) : (
        <ul className="space-y-6">
          {videos.map((video, idx) => (
            <li key={`${video.videoID}-${idx}`} className="p-4 bg-white rounded shadow">
              <div className="font-semibold mb-2">{video.unitName || `Video ${idx + 1}`}</div>
              <div className="text-gray-600 text-sm mb-2">{video.unitDescription}</div>
              <video
                src={video.videoID}
                controls
                className="w-full max-w-2xl mb-2 rounded"
              >
                Your browser does not support the video tag.
              </video>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SectionPage; 