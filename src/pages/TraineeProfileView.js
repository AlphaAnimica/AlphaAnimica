import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Phone, MapPin, GraduationCap, Briefcase, Upload } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TraineeProfileView = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/trainee/profile/${id}`);
        if (!res.ok) throw new Error('Profile not found');
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainee Profile</h1>
        <p className="text-gray-600">View trainee information</p>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10 w-full max-w-2xl flex flex-col items-center">
            <div className="mb-6 relative group">
              {profile.profile_photo ? (
                <img src={`/${profile.profile_photo}`} alt="Profile" className="h-32 w-32 rounded-full object-cover shadow border-4 border-primary-100" />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 shadow border-4 border-primary-100">
                  <User className="h-16 w-16" />
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2 text-center">{profile.name || 'Trainee'}</h2>
            <div className="w-full mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Phone</span>
                  <span className="font-semibold text-gray-900">{profile.phone || '-'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Location</span>
                  <span className="font-semibold text-gray-900">{profile.location || '-'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Education</span>
                  <span className="font-semibold text-gray-900">{profile.education || '-'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">University Year</span>
                  <span className="font-semibold text-gray-900">{profile.university_year || '-'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs text-gray-500 mb-1">Skills</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(profile.skills || '').split(',').filter(s => s.trim()).length > 0
                      ? (profile.skills || '').split(',').filter(s => s.trim()).map((skill, idx) => (
                          <span key={idx} className="inline-block bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full border border-primary-200 font-medium">
                            {skill.trim()}
                          </span>
                        ))
                      : <span className="font-semibold text-gray-900">-</span>
                    }
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs text-gray-500 mb-1">Experience</span>
                  <span className="font-semibold text-gray-900">{profile.experience || '-'}</span>
                </div>
                {profile.resume_path && (
                  <div className="sm:col-span-2">
                    <span className="block text-xs text-gray-500 mb-1">Resume</span>
                    <a href={`${BASE_URL}/${profile.resume_path}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline font-semibold">View Resume</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraineeProfileView; 