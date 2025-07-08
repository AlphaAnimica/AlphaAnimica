import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, Heart, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    // Trainee fields
    phone: '',
    location: '',
    education: '',
    skills: '',
    experience: '',
    resume: null,
    profilePhoto: null,
    universityYear: '',
    // Clinic fields
    clinicName: '',
    clinicPhone: '',
    address: '',
    description: '',
    website: '',
    logo: null
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.userType) {
      toast.error('Please select a user type');
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center justify-center border rounded-lg p-4 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-semibold shadow-sm
                    ${formData.userType === 'trainee' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-200' : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'trainee' }))}
                  tabIndex={0}
                  aria-pressed={formData.userType === 'trainee'}
                >
                  <span className="flex items-center mb-1">
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                    </span>
                    Trainee
                  </span>
                  <span className="text-xs font-normal text-gray-500">Looking for opportunities</span>
                </button>
                <button
                  type="button"
                  className={`flex-1 flex flex-col items-center justify-center border rounded-lg p-4 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-semibold shadow-sm
                    ${formData.userType === 'clinic' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-200' : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'}`}
                  onClick={() => setFormData(prev => ({ ...prev, userType: 'clinic' }))}
                  tabIndex={0}
                  aria-pressed={formData.userType === 'clinic'}
                >
                  <span className="flex items-center mb-1">
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4a2 2 0 012-2h2a2 2 0 012 2v4m0 0h4m-4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4m0 0h4m-4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" /></svg>
                    </span>
                    Clinic
                  </span>
                  <span className="text-xs font-normal text-gray-500">Offering opportunities</span>
                </button>
              </div>
            </div>
            
            {/* Trainee fields */}
            {formData.userType === 'trainee' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleProfileChange} className="input-field" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleProfileChange} className="input-field" placeholder="City, State" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <textarea name="education" rows={2} value={formData.education} onChange={handleProfileChange} className="input-field" placeholder="Your education background" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills</label>
                  <textarea name="skills" rows={2} value={formData.skills} onChange={handleProfileChange} className="input-field" placeholder="List your skills, separated by commas (e.g. Surgery, Communication, Teamwork)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <textarea name="experience" rows={2} value={formData.experience} onChange={handleProfileChange} className="input-field" placeholder="Your experience" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume (optional)</label>
                  <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleProfileChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Photo (optional)</label>
                  <input type="file" name="profilePhoto" accept="image/*" onChange={handleProfileChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">University Year</label>
                  <select name="universityYear" value={formData.universityYear} onChange={handleProfileChange} className="input-field">
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="graduated">Graduated</option>
                  </select>
                </div>
              </>
            )}
            {/* Clinic fields */}
            {formData.userType === 'clinic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Clinic Name</label>
                  <input type="text" name="clinicName" value={formData.clinicName} onChange={handleProfileChange} className="input-field" placeholder="Clinic name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" name="clinicPhone" value={formData.clinicPhone} onChange={handleProfileChange} className="input-field" placeholder="Clinic phone" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea name="address" rows={2} value={formData.address} onChange={handleProfileChange} className="input-field" placeholder="Clinic address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" rows={2} value={formData.description} onChange={handleProfileChange} className="input-field" placeholder="Clinic description" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input type="url" name="website" value={formData.website} onChange={handleProfileChange} className="input-field" placeholder="https://clinic.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo (optional)</label>
                  <input type="file" name="logo" accept="image/*" onChange={handleProfileChange} className="input-field" />
                </div>
              </>
            )}
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 rounded-lg shadow-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10 rounded-lg shadow-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 