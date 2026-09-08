import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, User, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI } from '../../services/api';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
          const res = await dashboardAPI.search(searchQuery);
          setSearchResults(res.data);
        } catch { setSearchResults(null); }
      } else {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/certifications', label: 'Certifications' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  const isTestPage = location.pathname.startsWith('/test/');

  if (isTestPage) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-3'
    }`} style={{
      background: scrolled ? 'var(--bg-glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-color)' : 'none',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="2" />
                <circle cx="4" cy="7" r="1.5" />
                <circle cx="20" cy="7" r="1.5" />
                <circle cx="4" cy="17" r="1.5" />
                <circle cx="20" cy="17" r="1.5" />
                <line x1="10.2" y1="11" x2="5.3" y2="8" />
                <line x1="13.8" y1="11" x2="18.7" y2="8" />
                <line x1="10.2" y1="13" x2="5.3" y2="16" />
                <line x1="13.8" y1="13" x2="18.7" y2="16" />
              </svg>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>NetworkPrep</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline" style={{
                color: location.pathname === link.to ? '#1e40af' : 'var(--text-secondary)',
                background: location.pathname === link.to ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
              }}>
                {link.label}
              </Link>
            ))}
            {user && (
              <Link to="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline" style={{
                color: location.pathname === '/dashboard' ? '#1e40af' : 'var(--text-secondary)',
                background: location.pathname === '/dashboard' ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
              }}>
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative hidden sm:block">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)', background: searchOpen ? 'var(--bg-tertiary)' : 'transparent' }}>
                <Search size={18} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
                  <input autoFocus type="text" placeholder="Search certifications, topics..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field rounded-none border-0" style={{ borderBottom: '1px solid var(--border-color)' }} />
                  {searchResults && (
                    <div className="max-h-64 overflow-y-auto p-2">
                      {searchResults.certifications?.map(c => (
                        <button key={c.id} onClick={() => { navigate(`/cert/${c.slug}`); setSearchOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:opacity-80 transition-colors flex items-center gap-2" style={{ color: 'var(--text-primary)', background: 'transparent' }}>
                          <Shield size={14} style={{ color: c.color }} />
                          {c.name}
                        </button>
                      ))}
                      {searchResults.topics?.map(t => (
                        <button key={t.id} onClick={() => { navigate(`/cert/${t.certification?.slug}`); setSearchOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:opacity-80 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                          {t.name} <span className="text-xs opacity-60">• {t.certification?.code}</span>
                        </button>
                      ))}
                      {searchResults.certifications?.length === 0 && searchResults.topics?.length === 0 && (
                        <p className="text-center py-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>No results found</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2.5 rounded-xl transition-all" style={{ color: 'var(--text-secondary)' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User Menu */}
            {user ? (
              <div ref={userMenuRef} className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gradient-primary)' }}>
                    {user.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.fullName?.split(' ')[0]}</span>
                  <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-xl py-2 overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
                    <div className="px-4 py-2 mb-1" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{user.fullName}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user.mobile}</p>
                    </div>
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors no-underline" style={{ color: 'var(--text-secondary)' }}>
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/analytics" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors no-underline" style={{ color: 'var(--text-secondary)' }}>
                      <User size={16} /> Analytics
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors no-underline" style={{ color: '#a855f7' }}>
                        <Shield size={16} /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 px-4 py-2.5 text-sm w-full text-left transition-colors" style={{ color: '#ef4444' }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-5 !text-sm no-underline">Sign In</Link>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2.5 rounded-xl" style={{ color: 'var(--text-secondary)' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="block px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: 'var(--text-primary)' }}>
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/dashboard" className="block px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: 'var(--text-primary)' }}>Dashboard</Link>
                <Link to="/analytics" className="block px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: 'var(--text-primary)' }}>Analytics</Link>
                {isAdmin && <Link to="/admin" className="block px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: '#a855f7' }}>Admin Panel</Link>}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
