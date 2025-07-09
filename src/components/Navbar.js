import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Home, Briefcase, FileText, Settings, List, Gift } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  let navItems = [];
  let adminTab = 'dashboard';
  if (user?.userType === 'admin') {
    const queryTab = new URLSearchParams(location.search).get('tab');
    adminTab = queryTab || 'dashboard';
    navItems = [
      { name: 'Dashboard', href: '/admin?tab=dashboard', key: 'dashboard', icon: Home },
      { name: 'Users', href: '/admin?tab=users', key: 'users', icon: User },
      { name: 'Opportunities', href: '/admin?tab=opps', key: 'opps', icon: Briefcase },
      { name: 'Applications', href: '/admin?tab=apps', key: 'apps', icon: FileText },
      { name: 'Reviews', href: '/admin?tab=reviews', key: 'reviews', icon: List },
      { name: 'Profiles', href: '/admin?tab=profiles', key: 'profiles', icon: User },
      { name: 'Subscriptions', href: '/admin?tab=subs', key: 'subs', icon: Gift },
    ];
  } else if (user?.userType === 'clinic') {
    navItems.push({ name: 'Dashboard', href: '/dashboard', icon: Home });
    navItems.splice(1, 0, { name: 'Create Opportunity', href: '/create-opportunity', icon: Briefcase });
    navItems.push({ name: 'Opportunities', href: '/opportunities', icon: Briefcase });
    navItems.push({ name: 'Applications', href: '/applications', icon: FileText });
    navItems.push({ name: 'Profile', href: '/profile', icon: Settings });
  } else if (user?.userType === 'trainee') {
    navItems.push({ name: 'Dashboard', href: '/dashboard', icon: Home });
    navItems.push({ name: 'Opportunities', href: '/opportunities', icon: Briefcase });
    navItems.push({ name: 'Applications', href: '/applications', icon: FileText });
    navItems.push({ name: 'Profile', href: '/profile', icon: Settings });
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* Logo: use provided logo.png */}
              <img src="/logo.png" alt="Alpha Animica Logo" className="mr-2 rounded-full" style={{height:48, width:48, objectFit:'cover'}} />
              <h1 className="text-xl font-extrabold tracking-tight text-primary-600" style={{letterSpacing: '0.02em'}}>Alpha Animica</h1>
            </Link>
          </div>
          {user ? (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                {user.userType === 'admin' ? (
                  navItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => navigate(item.href)}
                      className={`text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${adminTab === item.key ? 'bg-primary-600 text-white' : ''}`}
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </div>
              {/* User Menu */}
              <div className="hidden md:flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-red-600 p-2 rounded-md transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center ml-auto">
              <Link
                to="/register"
                className="ml-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-colors text-base"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Navigation */}
      {user && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-700">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 p-2 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 