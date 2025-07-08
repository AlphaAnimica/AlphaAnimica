import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    skills_required: '',
    location: '',
    is_paid: false,
    salary_range: '',
    level: ''
  });

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const res = await axios.get(`/api/opportunities/${id}`);
        setForm({
          title: res.data.title || '',
          description: res.data.description || '',
          requirements: res.data.requirements || '',
          skills_required: res.data.skills_required || '',
          location: res.data.location || '',
          is_paid: !!res.data.is_paid,
          salary_range: res.data.salary_range || '',
          level: res.data.level || ''
        });
      } catch (err) {
        toast.error('Failed to load opportunity');
        navigate('/opportunities');
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/opportunities/${id}`, form);
      toast.success('Opportunity updated!');
      navigate(`/opportunities/${id}`);
    } catch (err) {
      toast.error('Failed to update opportunity');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Opportunity</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
          <input type="text" name="requirements" value={form.requirements} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
          <input type="text" name="skills_required" value={form.skills_required} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
          <input type="text" name="salary_range" value={form.salary_range} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
          <select name="level" value={form.level} onChange={handleChange} className="input-field">
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_paid" checked={form.is_paid} onChange={handleChange} id="is_paid" className="mr-2" />
          <label htmlFor="is_paid" className="text-sm font-medium text-gray-700">Paid Position</label>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
};

export default EditOpportunity; 