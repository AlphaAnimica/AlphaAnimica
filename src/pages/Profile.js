import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { User, Phone, MapPin, GraduationCap, Briefcase, Building, Globe, Upload, Trash2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [photosChanged, setPhotosChanged] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user.userType === 'clinic') {
      const fetchReviews = async () => {
        try {
          setReviewLoading(true);
          const [reviewsRes, statsRes] = await Promise.all([
            axios.get(`/api/clinic/${user.id}/reviews`),
            axios.get(`/api/clinic/${user.id}/rating-stats`)
          ]);
          setReviews(reviewsRes.data);
          setRatingStats(statsRes.data);
        } catch (err) {
          setReviews([]);
          setRatingStats(null);
        } finally {
          setReviewLoading(false);
        }
      };
      fetchReviews();
    }
  }, [user.id, loading, user.userType]);

  useEffect(() => {
    if (user.userType === 'clinic') {
      axios.get(`/api/clinic/${user.id}/photos`).then(res => setPhotos(res.data)).catch(() => setPhotos([]));
    }
  }, [user.id, loading, user.userType]);

  const fetchProfile = async () => {
    try {
      const endpoint = user.userType === 'trainee' ? '/api/trainee/profile' : '/api/clinic/profile';
      const response = await axios.get(endpoint);
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const endpoint = user.userType === 'trainee' ? '/api/trainee/profile' : '/api/clinic/profile';
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      await axios.post(endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Profile updated successfully!');
      fetchProfile();
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setPendingPhotos(prev => [...prev, ...files]);
    setPhotosChanged(true);
  };

  const handleSavePhotos = async () => {
    if (!pendingPhotos.length) return;
    setPhotoUploading(true);
    const formData = new FormData();
    pendingPhotos.forEach(file => formData.append('photos', file));
    try {
      await axios.post('/api/clinic/photos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photos uploaded!');
      const res = await axios.get(`/api/clinic/${user.id}/photos`);
      setPhotos(res.data);
      setPendingPhotos([]);
      setPhotosChanged(false);
    } catch (err) {
      toast.error('Photo upload failed');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleRemovePendingPhoto = (idx) => {
    setPendingPhotos(pendingPhotos.filter((_, i) => i !== idx));
    setPhotosChanged(true);
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await axios.delete(`/api/clinic/photos/${photoId}`);
      setPhotos(photos.filter(p => p.id !== photoId));
      toast.success('Photo deleted');
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (user.userType === 'clinic') {
    // Helper for stars
    const renderStars = (rating, size = 'md') => {
      const sizeClasses = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' };
      return (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.6,7.6 6,11.9 4.8,17.8 9.9,14.8 15,17.8 13.8,11.9 18.2,7.6 12.2,6.6 "/></svg>
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
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
          </div>
          <span className="text-sm text-gray-600 w-8">{count}</span>
        </div>
      );
    };

    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Profile Card */}
          <div className="col-span-2 flex flex-col">
            <div className={`bg-white rounded-2xl border border-gray-200 shadow flex-1 flex flex-col justify-between p-8`}>
              {/* Edit button for general info */}
              {!editMode && (
                <div className="flex justify-end mb-2">
                  <button
                    className="btn-primary px-4 py-2 rounded-lg text-white font-semibold"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
              {/* General Info Form or Display */}
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-6 relative group">
                      {formData.logo ? (
                        <img src={typeof formData.logo === 'string' ? `/${formData.logo}` : URL.createObjectURL(formData.logo)} alt="Clinic Logo" className="h-36 w-36 rounded-full object-cover shadow border-4 border-primary-100" />
                      ) : (
                        <div className="h-36 w-36 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 shadow border-4 border-primary-100">
                          <Building className="h-20 w-20" />
                        </div>
                      )}
                      <input type="file" name="logo" accept="image/*" onChange={handleFileChange} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Building className="h-4 w-4 inline mr-1" />
                          Clinic Name
                        </label>
                        <input
                          type="text"
                          name="clinic_name"
                          value={formData.clinic_name || ''}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter clinic name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="h-4 w-4 inline mr-1" />
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone || ''}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Globe className="h-4 w-4 inline mr-1" />
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={formData.website || ''}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter website URL"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address || ''}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter address"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          rows={3}
                          value={formData.description || ''}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Describe your clinic..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-4 pt-4">
                    <button type="button" onClick={() => { setEditMode(false); setFormData(profile); }} className="btn-secondary">Cancel</button>
                    <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <div className="mb-6 relative group">
                      {profile.logo_path ? (
                        <img src={`/${profile.logo_path}`} alt="Clinic Logo" className="h-36 w-36 rounded-full object-cover shadow border-4 border-primary-100" />
                      ) : (
                        <div className="h-36 w-36 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 shadow border-4 border-primary-100">
                          <Building className="h-20 w-20" />
                        </div>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-center mt-2">{profile.clinic_name || 'Clinic'}</h2>
                    {ratingStats && ratingStats.total_reviews > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        {renderStars(Math.round(ratingStats.average_rating), 'md')}
                        <span className="text-lg font-semibold text-gray-900">{ratingStats.average_rating.toFixed(1)}</span>
                        <span className="text-gray-600">({ratingStats.total_reviews} reviews)</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t w-full my-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Phone</span>
                      <span className="font-semibold text-gray-900">{profile.phone || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500 mb-1">Location</span>
                      <span className="font-semibold text-gray-900">{profile.address || '-'}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="block text-xs text-gray-500 mb-1">Website</span>
                      {profile.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-600 hover:text-primary-700 underline break-all">{profile.website}</a>
                      ) : (
                        <span className="font-semibold text-gray-900">-</span>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <span className="block text-xs text-gray-500 mb-1">Description</span>
                      <span className="font-semibold text-gray-900">{profile.description || '-'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Rating Stats Sidebar */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-200 shadow p-6 flex-1 flex flex-col justify-between min-h-[220px]">
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
                      <div className="text-2xl font-bold text-gray-900">{ratingStats.average_rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No reviews yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Gallery - modern UI, max 4 columns, always show Add Photo at end, hover effect, subtle bg */}
        <div className="w-full max-w-5xl mx-auto mt-10 mb-10">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Photos</h3>
            <input
              type="file"
              id="clinic-photo-upload"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={photoUploading}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Existing photos */}
              {photos.map(photo => (
                <div key={photo.id} className="relative group overflow-hidden rounded-lg border border-gray-300 shadow-sm bg-white hover:shadow-lg transition">
                  <img src={`/${photo.photo_path}`} alt="Clinic" className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105" />
                  {user.userType === 'clinic' && user.id === profile.user_id && (
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1 text-red-600 hover:text-red-800 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete photo"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              {/* Pending (new) photos */}
              {user.userType === 'clinic' && user.id === profile.user_id && pendingPhotos.map((file, idx) => (
                <div key={idx} className="relative group overflow-hidden rounded-lg border-2 border-primary-400 shadow-sm bg-primary-50 hover:shadow-lg transition">
                  <img src={URL.createObjectURL(file)} alt="New" className="w-full h-32 object-cover opacity-80" />
                  <button
                    type="button"
                    onClick={() => handleRemovePendingPhoto(idx)}
                    className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1 text-red-600 hover:text-red-800 shadow opacity-100 transition-opacity"
                    title="Remove photo"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {/* +1 Add More Card */}
              {user.userType === 'clinic' && user.id === profile.user_id && (
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-primary-400 rounded-lg h-32 cursor-pointer hover:bg-primary-100 transition"
                  onClick={() => document.getElementById('clinic-photo-upload').click()}
                  title="Add more photos"
                >
                  <span className="text-3xl text-primary-500 font-bold">+</span>
                  <span className="text-xs text-primary-500 mt-1">Add Photo</span>
                </div>
              )}
              {/* Empty state */}
              {photos.length === 0 && pendingPhotos.length === 0 && user.userType !== 'clinic' && (
                <div className="col-span-4 flex flex-col items-center justify-center py-10 text-gray-400">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <div className="text-base">No photos uploaded yet.</div>
                </div>
              )}
            </div>
            {/* Save/Cancel for photos */}
            {user.userType === 'clinic' && user.id === profile.user_id && photosChanged && (
              <div className="flex items-center justify-end space-x-4 pt-6 border-t mt-6">
                <button type="button" onClick={() => { setPendingPhotos([]); setPhotosChanged(false); }} className="btn-secondary">Cancel</button>
                <button type="button" onClick={handleSavePhotos} disabled={photoUploading} className="btn-primary">{photoUploading ? 'Saving...' : 'Save Photos'}</button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="w-full max-w-5xl mx-auto mt-10 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
            </div>
            <div className="p-6">
              {reviewLoading ? (
                <div>Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {review.profile_photo ? (
                            <img src={`/${review.profile_photo}`} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">{review.trainee_name?.charAt(0) || 'T'}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{review.trainee_name}</h4>
                            <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="mb-2">{renderStars(review.rating, 'sm')}</div>
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
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user.userType === 'trainee' ? 'Trainee Profile' : 'Clinic Profile'}
        </h1>
        <p className="text-gray-600">
          {editMode ? 'Edit your information' : 'View your information'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          {!editMode && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
                  try {
                    await axios.delete('/api/profile');
                    toast.success('Profile deleted. Goodbye!');
                    if (window.localStorage) window.localStorage.clear();
                    window.location.href = '/';
                  } catch (err) {
                    toast.error('Failed to delete profile');
                  }
                }
              }}
            >
              Delete Profile
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {user.userType === 'trainee' ? (
              // Trainee Profile Form
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="h-4 w-4 inline mr-1" />
                    Education
                  </label>
                  <textarea
                    name="education"
                    rows={3}
                    value={formData.education || ''}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe your educational background..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Briefcase className="h-4 w-4 inline mr-1" />
                    Skills
                  </label>
                  <textarea
                    name="skills"
                    rows={3}
                    value={formData.skills || ''}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="List your veterinary skills and competencies..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Experience
                  </label>
                  <textarea
                    name="experience"
                    rows={4}
                    value={formData.experience || ''}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe your veterinary experience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    name="profilePhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                  {profile.profile_photo && (
                    <p className="text-sm text-green-600 mt-1">
                      Current photo: <img src={`/${profile.profile_photo}`} alt="Profile" className="h-12 w-12 rounded-full inline-block ml-2 align-middle object-cover border" />
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="h-4 w-4 inline mr-1" />
                    Resume
                  </label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  {profile.resume_path && (
                    <p className="text-sm text-green-600 mt-1">
                      Current resume: {profile.resume_path.split('/').pop()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Year</label>
                  <select
                    name="universityYear"
                    value={formData.universityYear || ''}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="6">6th Year</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </>
            ) : (
              // Clinic Profile Form
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="h-4 w-4 inline mr-1" />
                      Clinic Name
                    </label>
                    <input
                      type="text"
                      name="clinic_name"
                      value={formData.clinic_name || ''}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter clinic name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-1" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe your clinic..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter website URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="h-4 w-4 inline mr-1" />
                    Clinic Logo
                  </label>
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Accepted formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                  {profile.logo_path && (
                    <p className="text-sm text-green-600 mt-1">
                      Current logo: {profile.logo_path.split('/').pop()}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button type="button" onClick={() => { setEditMode(false); setFormData(profile); }} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            {!editMode && user.userType === 'trainee' && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 bg-gray-50">
                <div className="bg-white rounded-2xl shadow-xl px-8 py-10 w-full max-w-2xl flex flex-col items-center">
                  <div className="mb-6 relative group">
                    {profile.profile_photo ? (
                      <img src={`/${profile.profile_photo}`} alt="Profile" className="h-32 w-32 rounded-full object-cover shadow border-4 border-primary-100" />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 shadow border-4 border-primary-100">
                        <span>{user.name?.[0]?.toUpperCase() || '?'}</span>
                      </div>
                    )}
                    <button
                      className="absolute bottom-2 right-2 bg-primary-600 text-white rounded-full p-2 shadow-lg opacity-80 hover:opacity-100 transition-opacity group-hover:opacity-100"
                      title="Edit Photo"
                      onClick={() => setEditMode(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.414a1 1 0 01-1.263-1.263l1.414-4.243a4 4 0 01.828-1.414z" /></svg>
                    </button>
                  </div>
                  <h2 className="text-3xl font-bold mb-2 text-center">{user.name}</h2>
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 