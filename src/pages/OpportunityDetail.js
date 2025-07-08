import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { MapPin, DollarSign, Briefcase, Building, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const OpportunityDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    resume: null
  });

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const response = await axios.get(`/api/opportunities/${id}`);
      setOpportunity(response.data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to load opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setApplicationForm(prev => ({
      ...prev,
      resume: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!applicationForm.coverLetter.trim()) {
      toast.error('Please provide a cover letter');
      return;
    }

    setApplying(true);
    
    try {
      const formData = new FormData();
      formData.append('opportunityId', id);
      formData.append('coverLetter', applicationForm.coverLetter);
      if (applicationForm.resume) {
        formData.append('resume', applicationForm.resume);
      }

      await axios.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Application submitted successfully!');
      navigate('/applications');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Opportunity not found</h1>
          <p className="text-gray-600">The opportunity you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
              <p className="text-xl text-primary-100 mb-4">{opportunity.clinic_name}</p>
              <div className="flex items-center space-x-6 text-primary-100">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {opportunity.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {opportunity.is_paid ? 'Paid Position' : 'Unpaid Position'}
                </div>
                {opportunity.level && (
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    {opportunity.level}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                opportunity.is_paid ? 'bg-green-500' : 'bg-gray-500'
              }`}>
                {opportunity.is_paid ? 'Paid' : 'Unpaid'}
              </span>
              {user && user.userType === 'clinic' && user.id === opportunity.clinic_id && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="btn-secondary text-sm"
                    onClick={() => navigate(`/opportunities/${opportunity.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white text-sm rounded px-3 py-1"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this opportunity?')) {
                        try {
                          await axios.delete(`/api/opportunities/${opportunity.id}`);
                          toast.success('Opportunity deleted');
                          navigate('/opportunities');
                        } catch (err) {
                          toast.error('Failed to delete opportunity');
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{opportunity.description}</p>
          </div>

          {opportunity.requirements && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <p className="text-gray-700 leading-relaxed">{opportunity.requirements}</p>
            </div>
          )}

          {opportunity.skills_required && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills_required.split(',').map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {opportunity.salary_range && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Salary Range</h3>
                <p className="text-gray-700">{opportunity.salary_range}</p>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Posted Date</h3>
              <p className="text-gray-700">
                {new Date(opportunity.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Clinic</h2>
            <div className="flex items-start space-x-4">
              <Building className="h-6 w-6 text-primary-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">
                  <Link to={`/clinic/${opportunity.clinic_id}`} className="text-primary-700 hover:underline">
                    {opportunity.clinic_name}
                  </Link>
                </h3>
                <Link
                  to={`/clinic/${opportunity.clinic_id}`}
                  className="inline-block mt-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors font-semibold shadow focus:outline-none focus:ring-2 focus:ring-primary-400"
                  aria-label={`View profile of ${opportunity.clinic_name}`}
                >
                  View Clinic Profile
                </Link>
                <p className="text-gray-600 mt-1">{opportunity.clinic_description}</p>
                <p className="text-gray-600 mt-1">{opportunity.address}</p>
              </div>
            </div>
          </div>

          {user?.userType === 'trainee' && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Apply for this Position</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={6}
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                    className="input-field"
                    placeholder="Tell us why you're interested in this position and what makes you a great candidate..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                    Resume (Optional)
                  </label>
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/opportunities')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!user && (
            <div className="border-t pt-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Interested in this position?</h2>
              <p className="text-gray-600 mb-6">
                Sign up as a trainee to apply for this opportunity.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail; 