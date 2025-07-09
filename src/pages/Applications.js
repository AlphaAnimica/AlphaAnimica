import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { FileText, Calendar, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Applications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    scheduledDate: '',
    notes: '',
    type: 'online',
    meetingLink: '',
    location: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      await axios.put(`/api/applications/${applicationId}/status`, { status });
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    
    if (!interviewForm.scheduledDate) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      await axios.post('/api/interviews', {
        applicationId: selectedApplication.id,
        scheduledDate: interviewForm.scheduledDate,
        notes: interviewForm.notes,
        type: interviewForm.type,
        meetingLink: interviewForm.meetingLink,
        location: interviewForm.location
      });
      
      toast.success('Interview scheduled successfully!');
      setShowInterviewModal(false);
      setSelectedApplication(null);
      setInterviewForm({ scheduledDate: '', notes: '', type: 'online', meetingLink: '', location: '' });
      fetchApplications();
    } catch (error) {
      toast.error('Failed to schedule interview');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'interview': return <Calendar className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user.userType === 'trainee' ? 'My Applications' : 'Applications Received'}
        </h1>
        <p className="text-gray-600">
          {user.userType === 'trainee' 
            ? 'Track the status of your training applications' 
            : 'Review and manage applications from trainees'
          }
        </p>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.userType === 'clinic' ? (
                        <Link
                          to={`/trainee/${application.trainee_id}`}
                          className="text-primary-700 font-semibold transition-colors duration-150 hover:text-primary-900 hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
                          aria-label={`View profile of ${application.trainee_name}`}
                        >
                          {application.trainee_name}
                        </Link>
                      ) : application.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span>{application.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {user.userType === 'trainee' ? application.clinic_name : application.title}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {application.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {new Date(application.applied_at).toLocaleDateString()}
                    </div>
                  </div>

                  {application.cover_letter && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter:</h4>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}

                  {user.userType === 'clinic' && application.education && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Education:</h4>
                      <p className="text-gray-600 text-sm">{application.education}</p>
                    </div>
                  )}

                  {application.resume_path && (
                    <div className="mb-4">
                      <a
                        href={`http://localhost:5000/${application.resume_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Resume
                      </a>
                    </div>
                  )}

                  {application.status === 'interview' && application.interview_date && (
                    <div className="flex items-center mt-2 text-blue-700 text-sm font-medium">
                      <Calendar className="h-4 w-4 mr-1" />
                      Interview Scheduled: {new Date(application.interview_date).toLocaleString()}
                      {user.userType === 'clinic' ? (
                        <button
                          className="ml-2 flex items-center text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="Reschedule Interview"
                          onClick={() => {
                            setSelectedApplication(application);
                            setInterviewForm({
                              scheduledDate: application.interview_date ? new Date(application.interview_date).toISOString().slice(0, 16) : '',
                              notes: application.interview_notes || '',
                              type: application.interview_type || 'online',
                              meetingLink: application.interview_meeting_link || '',
                              location: application.interview_location || ''
                            });
                            setShowInterviewModal(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z" /></svg>
                          Edit
                        </button>
                      ) : (
                        <button
                          className="ml-2 flex items-center text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                          title="View Interview Details"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowInterviewModal(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 1118 0a9 9 0 01-18 0z" /></svg>
                          View Details
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {user.userType === 'clinic' && (application.status === 'pending' || application.status === 'interview') && (
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'accepted')}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setInterviewForm({
                          scheduledDate: application.interview_date ? new Date(application.interview_date).toISOString().slice(0, 16) : '',
                          notes: application.interview_notes || '',
                          type: application.interview_type || 'online',
                          meetingLink: application.interview_meeting_link || '',
                          location: application.interview_location || ''
                        });
                        setShowInterviewModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Schedule Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {user.userType === 'trainee' 
              ? 'You haven\'t applied to any opportunities yet.' 
              : 'No applications have been received yet.'
            }
          </p>
        </div>
      )}

      {/* Interview Scheduling Modal */}
      {showInterviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 border w-full max-w-lg shadow-lg rounded-xl bg-white">
            <div className="mt-3">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                {user.userType === 'clinic' ? 'Schedule Interview' : 'Interview Details'}
              </h3>
              {user.userType === 'clinic' ? (
                <form onSubmit={scheduleInterview} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={interviewForm.scheduledDate}
                      onChange={(e) => setInterviewForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="input-field w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interview Type
                    </label>
                    <select
                      className="input-field w-full"
                      value={interviewForm.type || 'online'}
                      onChange={e => setInterviewForm(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  {interviewForm.type === 'online' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        className="input-field w-full"
                        placeholder="https://..."
                        value={interviewForm.meetingLink || ''}
                        onChange={e => setInterviewForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                  {interviewForm.type === 'offline' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        className="input-field w-full"
                        placeholder="Clinic address or Google Maps link"
                        value={interviewForm.location || ''}
                        onChange={e => setInterviewForm(prev => ({ ...prev, location: e.target.value }))}
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      value={interviewForm.notes}
                      onChange={(e) => setInterviewForm(prev => ({ ...prev, notes: e.target.value }))}
                      className="input-field w-full"
                      placeholder="Any additional notes for the interview..."
                    />
                  </div>
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInterviewModal(false);
                        setSelectedApplication(null);
                        setInterviewForm({ scheduledDate: '', notes: '', type: 'online', meetingLink: '', location: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Schedule Interview
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    <span className="font-medium">Date & Time:</span>
                    <span className="ml-2">{selectedApplication.interview_date ? new Date(selectedApplication.interview_date).toLocaleString() : 'Not set'}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium mr-2">Type:</span>
                    <span>{selectedApplication.interview_type === 'offline' ? 'Offline' : 'Online'}</span>
                  </div>
                  {selectedApplication.interview_meeting_link && (
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Meeting Link:</span>
                      <a href={selectedApplication.interview_meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {selectedApplication.interview_meeting_link}
                      </a>
                    </div>
                  )}
                  {selectedApplication.interview_location && (
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Location:</span>
                      <a href={selectedApplication.interview_location} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {selectedApplication.interview_location}
                      </a>
                    </div>
                  )}
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex items-start text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
                    <div>
                      <span className="font-medium">Notes:</span>
                      <div className="ml-2 text-gray-600 whitespace-pre-line">{selectedApplication.interview_notes ? selectedApplication.interview_notes : <span className="italic text-gray-400">No notes provided.</span>}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInterviewModal(false);
                        setSelectedApplication(null);
                        setInterviewForm({ scheduledDate: '', notes: '', type: 'online', meetingLink: '', location: '' });
                      }}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications; 