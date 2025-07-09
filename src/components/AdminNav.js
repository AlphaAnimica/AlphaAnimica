import React from 'react';

const ADMIN_TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'users', label: 'Users' },
  { key: 'opps', label: 'Opportunities' },
  { key: 'apps', label: 'Applications' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'profiles', label: 'Profiles' },
  { key: 'subs', label: 'Subscriptions' },
];

const AdminNav = ({ tab, setTab }) => (
  <nav className="flex space-x-4 mb-8 bg-white rounded-lg shadow p-4">
    {ADMIN_TABS.map(item => (
      <button
        key={item.key}
        className={`px-4 py-2 rounded font-semibold ${tab === item.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-primary-100'}`}
        onClick={() => setTab(item.key)}
      >
        {item.label}
      </button>
    ))}
  </nav>
);

export default AdminNav; 