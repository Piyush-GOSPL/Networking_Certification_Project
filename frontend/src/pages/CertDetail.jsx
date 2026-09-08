import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle2, BookOpen, Clock, Target, Globe, Router, Cpu, Shield, Lock, Terminal, Cloud, RadioTower, Flame } from 'lucide-react';
import { certAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const iconMap = { router: Router, server: Cpu, network: Globe, shield: Shield, 'shield-check': Shield, cpu: Cpu, 'radio-tower': RadioTower, flame: Flame, globe: Globe, lock: Lock, terminal: Terminal, cloud: Cloud };

export default function CertDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certAPI.getBySlug(slug).then(res => { setCert(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  const handleStartTest = () => {
    if (!user) {
      navigate('/register', { state: { certId: cert.id, certSlug: slug } });
    } else {
      navigate('/test-config', { state: { certification: cert } });
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="skeleton w-16 h-16 rounded-xl mx-auto mb-4" />
        <div className="skeleton h-6 w-48 mx-auto mb-2" />
        <div className="skeleton h-4 w-32 mx-auto" />
      </div>
    </div>
  );

  if (!cert) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Certification not found</h2>
        <button onClick={() => navigate('/certifications')} className="btn-primary mt-4">Back to Certifications</button>
      </div>
    </div>
  );

  const Icon = iconMap[cert.icon] || Globe;

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/certifications')} className="flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-80 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Certifications
        </button>

        <div className="card p-8 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${cert.color}15` }}>
              <Icon size={36} style={{ color: cert.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{cert.name}</h1>
                <span className={`badge ${cert.level === 'beginner' ? 'badge-easy' : cert.level === 'intermediate' ? 'badge-medium' : 'badge-hard'}`}>
                  {cert.level}
                </span>
              </div>
              <p className="text-sm font-medium mb-3" style={{ color: cert.color }}>{cert.vendor}</p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{cert.description}</p>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <BookOpen size={16} style={{ color: '#1e40af' }} />
                  <span><strong style={{ color: 'var(--text-primary)' }}>{cert.questionCount}</strong> Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={16} style={{ color: '#1e40af' }} />
                  <span><strong style={{ color: 'var(--text-primary)' }}>{cert.examDuration}</strong> min Exam</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Target size={16} style={{ color: '#1e40af' }} />
                  <span>Pass: <strong style={{ color: 'var(--text-primary)' }}>{cert.passingScore <= 100 ? cert.passingScore + '%' : cert.passingScore}</strong></span>
                </div>
              </div>

              <button onClick={handleStartTest} className="btn-primary !py-3 !px-8">
                Start Practice Test <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Difficulty Distribution */}
        {cert.difficultyCount && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Question Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Easy', count: cert.difficultyCount.easy, color: '#22c55e' },
                { label: 'Medium', count: cert.difficultyCount.medium, color: '#f97316' },
                { label: 'Hard', count: cert.difficultyCount.hard, color: '#ef4444' },
              ].map(d => (
                <div key={d.label} className="text-center p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: d.color }}>{d.count}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{d.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Topics ({cert.topics?.length || 0})
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {cert.topics?.map(topic => (
              <div key={topic.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <CheckCircle2 size={18} style={{ color: cert.color }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{topic.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
