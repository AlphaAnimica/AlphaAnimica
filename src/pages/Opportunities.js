import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, DollarSign, Filter, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    isPaid: '',
    skills: ''
  });
  const { user } = useAuth();
  const [appliedOpportunityIds, setAppliedOpportunityIds] = useState([]);

  useEffect(() => {
    fetchOpportunities();
    if (user && user.userType === 'trainee') {
      axios.get('/api/applications').then(res => {
        setAppliedOpportunityIds(res.data.map(app => app.opportunity_id));
      });
    }
  }, [filters, user]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`/api/opportunities?${params}`);
      setOpportunities(response.data);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      isPaid: '',
      skills: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Opportunities</h1>
        <p className="text-gray-600">Find the perfect veterinary training position</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compensation</label>
            <select
              value={filters.isPaid}
              onChange={(e) => handleFilterChange('isPaid', e.target.value)}
              className="input-field"
            >
              <option value="">All</option>
              <option value="1">Paid</option>
              <option value="0">Unpaid</option>
            </select>
          </div>

          {/* Removed Level filter */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <input
              type="text"
              placeholder="Required skills"
              value={filters.skills}
              onChange={(e) => handleFilterChange('skills', e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {loading ? 'Loading...' : `${opportunities.length} opportunities found`}
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => {
            const isApplied = user && user.userType === 'trainee' && appliedOpportunityIds.includes(opportunity.id);
            return (
              <div key={opportunity.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600">{opportunity.clinic_name}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                      opportunity.is_paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {opportunity.is_paid ? 'Paid' : 'Unpaid'}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {opportunity.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {opportunity.location}
                    </div>
                    {/* Removed level display */}
                    {opportunity.salary_range && (
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {opportunity.salary_range}
                      </div>
                    )}
                  </div>

                  {opportunity.skills_required && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {opportunity.skills_required.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">
                      Posted {new Date(opportunity.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      {isApplied ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Applied</span>
                      ) : (
                        <Link
                          to={`/opportunities/${opportunity.id}`}
                          className="btn-primary text-sm"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later for new opportunities.</p>
        </div>
      )}
    </div>
  );
};

export default Opportunities; 