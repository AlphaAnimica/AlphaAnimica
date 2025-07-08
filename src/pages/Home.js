import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Users, MapPin, Star } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-[#2563eb] text-white overflow-hidden">
        {/* Logo background */}
        <img src="/backgroundlogo.png" alt="Alpha Animica Logo BG" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none select-none object-contain" style={{zIndex:1, opacity:0.05}} />
        {/* Gradient overlay for extra polish */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2563eb]/80 to-transparent" style={{zIndex:2}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" style={{zIndex:3}}>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect Veterinary Talent
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              The premier platform connecting veterinary trainees with clinic opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Alpha Animica?
            </h2>
            <p className="text-lg text-gray-600">
              Streamlined platform for veterinary professionals and clinics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Trainees</h3>
              <p className="text-gray-600">
                Find the perfect training opportunity, upload your resume, and track your applications all in one place.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Clinics</h3>
              <p className="text-gray-600">
                Post opportunities, review applications, and find qualified trainees to join your team.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location Based</h3>
              <p className="text-gray-600">
                Find opportunities near you or expand your search to discover new locations and experiences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Active Trainees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-gray-600">Partner Clinics</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">250+</div>
              <div className="text-gray-600">Opportunities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of veterinary professionals finding their perfect match
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Your Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 