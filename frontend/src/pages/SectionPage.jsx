import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ProgressContext } from '../context/ProgressContext';

const SectionPage = () => {
  const { courseId, sectionId } = useParams();
  const [section, setSection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const { notifyProgressChanged } = useContext(ProgressContext);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

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

  const handleMarkWatched = async (videoId) => {
    if (!token) return;
    try {
      await axios.post('http://localhost:5000/api/progress/watch-video', {
        courseId,
        sectionId,
        videoId
      }, { headers: { Authorization: `Bearer ${token}` } });
      notifyProgressChanged();
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleVideoEnd = () => {
    setShowPopup(true);
  };

  const handlePlayAgain = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    setShowPopup(false);
  };

  const handlePlayNext = async () => {
    const currentVideo = videos[selectedVideoIdx];
    await handleMarkWatched(currentVideo.videoID);
    const nextIdx = selectedVideoIdx + 1;
    if (nextIdx < videos.length) {
      setSelectedVideoIdx(nextIdx);
      setShowPopup(false);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.play();
      }, 100);
    }
  };

  const handleUnlockAssessment = async () => {
    const currentVideo = videos[selectedVideoIdx];
    await handleMarkWatched(currentVideo.videoID);
    setShowPopup(false);
    navigate('/courses');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const currentVideo = videos[selectedVideoIdx];
  const isLastVideo = selectedVideoIdx === videos.length - 1;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Section: {section?.sectionName}</h2>
      <h3 className="text-xl font-semibold mb-4">Videos</h3>
      {videos.length === 0 ? (
        <div>No videos found for this section.</div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl mb-4">
            <div className="font-semibold mb-2">{currentVideo.unitName || `Video ${selectedVideoIdx + 1}`}</div>
            <div className="text-gray-600 text-sm mb-2">{currentVideo.unitDescription}</div>
            <video
              ref={videoRef}
              src={currentVideo.videoID}
              controls
              className="w-full rounded"
              onEnded={handleVideoEnd}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-md text-center space-y-4">
                {isLastVideo ? (
                  <>
                    <h3 className="text-xl font-semibold">Section Complete!</h3>
                    <p>What would you like to do next?</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handlePlayAgain}
                      >
                        Watch Again
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handleUnlockAssessment}
                      >
                        Unlock Assessment
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold">Finished Watching</h3>
                    <p>What would you like to do next?</p>
                    <div className="flex gap-4 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={handlePlayAgain}
                      >
                        Play Again
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        onClick={handlePlayNext}
                      >
                        Play Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="w-full max-w-2xl mt-8">
            <ul className="space-y-2">
              {videos.map((video, idx) => (
                <li
                  key={`${video.videoID}-${idx}`}
                  className={`p-2 rounded ${idx === selectedVideoIdx ? 'bg-blue-100 font-bold' : 'bg-gray-100'}`}
                  onClick={() => setSelectedVideoIdx(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {video.unitName || `Video ${idx + 1}`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionPage; 