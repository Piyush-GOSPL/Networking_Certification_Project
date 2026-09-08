import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, Globe, Router, Cpu, Shield, Lock, Terminal, Cloud, RadioTower, Flame, BookOpen } from 'lucide-react';
import { certAPI } from '../services/api';

const iconMap = { router: Router, server: Cpu, network: Globe, shield: Shield, 'shield-check': Shield, cpu: Cpu, 'radio-tower': RadioTower, flame: Flame, globe: Globe, lock: Lock, terminal: Terminal, cloud: Cloud };

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    certAPI.getAll().then(res => { setCertifications(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = certifications.filter(c => {
    if (filter !== 'all' && c.level !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const levels = [
    { key: 'all', label: 'All Levels' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Certifications</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Choose your certification track and start practicing with realistic exam questions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Search certifications..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-11" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {levels.map(l => (
              <button key={l.key} onClick={() => setFilter(l.key)} className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{
                background: filter === l.key ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                color: filter === l.key ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === l.key ? 'transparent' : 'var(--border-color)'}`,
              }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-12 w-12 rounded-xl mb-4" />
                <div className="skeleton h-5 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/2 mb-4" />
                <div className="skeleton h-16 w-full mb-4" />
                <div className="skeleton h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(cert => {
              const Icon = iconMap[cert.icon] || Globe;
              return (
                <div key={cert.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${cert.color}15` }}>
                      <Icon size={26} style={{ color: cert.color }} />
                    </div>
                    <span className={`badge ${cert.level === 'beginner' ? 'badge-easy' : cert.level === 'intermediate' ? 'badge-medium' : 'badge-hard'}`}>
                      {cert.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{cert.name}</h3>
                  <p className="text-xs font-medium mb-3" style={{ color: cert.color }}>{cert.vendor}</p>
                  <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{cert.description}</p>

                  {/* Topics preview */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {cert.topics?.slice(0, 5).map(t => (
                      <span key={t.id} className="px-2.5 py-1 rounded-md text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                        {t.name}
                      </span>
                    ))}
                    {cert.topics?.length > 5 && (
                      <span className="px-2.5 py-1 rounded-md text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                        +{cert.topics.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <span className="flex items-center gap-1"><BookOpen size={13} /> {cert.questionCount || cert.totalQuestions} questions</span>
                    <span>{cert.examDuration} min exam</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/cert/${cert.slug}`)} className="btn-primary flex-1 !py-2.5 !text-sm">
                      Start Test <ArrowRight size={14} />
                    </button>
                    <button onClick={() => navigate(`/cert/${cert.slug}`)} className="btn-secondary !py-2.5 !px-4 !text-sm">
                      Topics
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Filter size={48} className="mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No certifications found</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
