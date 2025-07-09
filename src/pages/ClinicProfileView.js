import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building, Phone, MapPin, Globe, Star, MessageSquare, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL;

const ClinicProfileView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    feedback: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchClinicData();
    axios.get(`${BASE_URL}/api/clinic/${id}/photos`).then(res => setPhotos(res.data)).catch(() => setPhotos([]));
  }, [id]);

  const fetchClinicData = async () => {
    try {
      setLoading(true);
      const [profileRes, reviewsRes, statsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/clinic/profile/${id}`),
        axios.get(`${BASE_URL}/api/clinic/${id}/reviews`),
        axios.get(`${BASE_URL}/api/clinic/${id}/rating-stats`)
      ]);
      
      setProfile(profileRes.data);
      setReviews(reviewsRes.data);
      setRatingStats(statsRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load clinic profile');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.feedback.trim()) {
      toast.error('Please provide feedback');
      return;
    }

    setSubmittingReview(true);
    try {
      await axios.post(`${BASE_URL}/api/clinic/${id}/review`, reviewForm);
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, feedback: '' });
      fetchClinicData(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/clinic/${id}/review/${reviewId}`);
      toast.success('Review deleted successfully!');
      fetchClinicData(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete review');
    }
  };

  const renderStars = (rating, size = 'md') => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBar = (stars, count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 w-8">{stars}★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;
  if (error) return <div className="text-center text-red-600 mt-8">{error}</div>;
  if (!profile) return <div className="text-center text-gray-600 mt-8">Clinic profile not found.</div>;
  if (!loading && (!profile || error)) {
    return <div className="text-center text-red-600 mt-8">Something went wrong. Please try again later.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clinic Profile</h1>
        <p className="text-gray-600">View clinic information and reviews</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clinic Profile Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="flex flex-col items-center justify-center py-8 bg-gray-50">
              <div className="bg-white rounded-2xl shadow-xl px-8 py-10 w-full max-w-2xl flex flex-col items-center">
                <div className="mb-6 relative group">
                  {profile.logo_path ? (
                    <img 
                      src={`/${profile.logo_path}`} 
                      alt="Clinic Logo" 
                      className="h-32 w-32 rounded-full object-cover shadow border-4 border-primary-100" 
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 shadow border-4 border-primary-100">
                      <Building className="h-16 w-16" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-3xl font-bold mb-2 text-center">{profile.clinic_name || 'Clinic'}</h2>
                
                {/* Rating Display */}
                {ratingStats && ratingStats.total_reviews > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    {renderStars(Math.round(ratingStats.average_rating), 'md')}
                    <span className="text-lg font-semibold text-gray-900">
                      {ratingStats.average_rating.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({ratingStats.total_reviews} reviews)
                    </span>
                  </div>
                )}

                <div className="w-full mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Phone</span>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-semibold text-gray-900">{profile.phone || '-'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Location</span>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-semibold text-gray-900">{profile.address || '-'}</span>
                      </div>
                    </div>
                    
                    {profile.website && (
                      <div className="sm:col-span-2">
                        <span className="block text-xs text-gray-500 mb-1">Website</span>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-400 mr-2" />
                          <a 
                            href={profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-primary-600 hover:text-primary-700 underline"
                          >
                            {profile.website}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <div className="sm:col-span-2">
                      <span className="block text-xs text-gray-500 mb-1">Description</span>
                      <span className="font-semibold text-gray-900">{profile.description || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Stats Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
            
            {ratingStats && ratingStats.total_reviews > 0 ? (
              <div className="space-y-3">
                {renderRatingBar(5, ratingStats.five_star, ratingStats.total_reviews)}
                {renderRatingBar(4, ratingStats.four_star, ratingStats.total_reviews)}
                {renderRatingBar(3, ratingStats.three_star, ratingStats.total_reviews)}
                {renderRatingBar(2, ratingStats.two_star, ratingStats.total_reviews)}
                {renderRatingBar(1, ratingStats.one_star, ratingStats.total_reviews)}
                
                <div className="pt-3 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {ratingStats.average_rating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            )}

            {/* Review Button for Trainees */}
            {user && user.userType === 'trainee' && (
              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Write a Review</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && user && user.userType === 'trainee' && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback</label>
              <textarea
                value={reviewForm.feedback}
                onChange={(e) => setReviewForm(prev => ({ ...prev, feedback: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="4"
                placeholder="Share your experience with this clinic..."
                required
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
        </div>
        
        <div className="p-6">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className={`border-b border-gray-200 pb-6 last:border-b-0 ${
                  user && user.userType === 'trainee' && user.id === review.trainee_id 
                    ? 'bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500' 
                    : ''
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {review.profile_photo ? (
                        <img 
                          src={`/${review.profile_photo}`} 
                          alt="Profile" 
                          className="h-10 w-10 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.trainee_name?.charAt(0) || 'T'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{review.trainee_name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                          {user && user.userType === 'trainee' && user.id === review.trainee_id && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Your review
                            </span>
                          )}
                        </div>
                        
                        {/* Delete button for user's own reviews */}
                        {user && user.userType === 'trainee' && user.id === review.trainee_id && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete review"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-2">
                        {renderStars(review.rating, 'sm')}
                      </div>
                      
                      <p className="text-gray-700">{review.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this clinic!</p>
          )}
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mt-10 mb-10">
        <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.length === 0 && (
              <div className="col-span-4 flex flex-col items-center justify-center py-10 text-gray-400">
                <ImageIcon className="h-12 w-12 mb-2" />
                <div className="text-base">No photos uploaded yet.</div>
              </div>
            )}
            {photos.map(photo => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-gray-300 shadow-sm bg-white hover:shadow-lg transition">
                <img src={`/${photo.photo_path}`} alt="Clinic" className="w-full h-32 object-cover transition-transform duration-200 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicProfileView; 