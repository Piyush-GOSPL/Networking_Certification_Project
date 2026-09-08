import { Link } from 'react-router-dom';
import { Mail, Heart, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Certifications', to: '/certifications' },
        { label: 'Practice Tests', to: '/certifications' },
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Leaderboard', to: '/leaderboard' },
      ],
    },
    {
      title: 'Certifications',
      links: [
        { label: 'Cisco CCNA', to: '/cert/ccna' },
        { label: 'Cisco CCNP', to: '/cert/ccnp' },
        { label: 'CompTIA Network+', to: '/cert/network-plus' },
        { label: 'CompTIA Security+', to: '/cert/security-plus' },
        { label: 'Fortinet NSE', to: '/cert/fortinet' },
        { label: 'Juniper JNCIA', to: '/cert/jncia' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms & Conditions', to: '/terms' },
      ],
    },
  ];

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
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
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Practice smarter with realistic networking questions, topology-based scenarios, and detailed performance analytics.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, MessageCircle, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Sections */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm transition-colors no-underline hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            © 2026 NetworkPrep. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
            Made with <Heart size={14} className="text-red-500" fill="currentColor" /> for networking learners
          </p>
        </div>
      </div>
    </footer>
  );
}
