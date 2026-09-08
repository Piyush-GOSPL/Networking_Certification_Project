import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock, Zap, BookOpen, CheckSquare } from 'lucide-react';
import { certAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function TestConfig() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cert, setCert] = useState(location.state?.certification || null);
  const [certId, setCertId] = useState(location.state?.certification?.id || location.state?.certificationId || '');
  const [certs, setCerts] = useState([]);
  const [difficulty, setDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(25);
  const [mode, setMode] = useState('practice');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [allTopicsSelected, setAllTopicsSelected] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/register'); return; }
    certAPI.getAll().then(res => setCerts(res.data)).catch(() => {});
    if (certId && !cert) {
      certAPI.getById(certId).then(res => setCert(res.data)).catch(() => {});
    }
  }, [user, certId]);

  const toggleTopic = (topicId) => {
    setAllTopicsSelected(false);
    setSelectedTopics(prev => prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]);
  };

  const selectAllTopics = () => {
    setAllTopicsSelected(true);
    setSelectedTopics([]);
  };

  const handleStart = () => {
    if (!cert && !certId) { toast.error('Please select a certification'); return; }
    navigate('/test/active', {
      state: {
        certificationId: cert?.id || certId,
        certificationName: cert?.name,
        difficulty,
        questionCount,
        mode,
        selectedTopics: allTopicsSelected ? [] : selectedTopics,
      },
    });
  };

  const difficulties = [
    { key: 'easy', label: 'Beginner', desc: 'Fundamental concepts' },
    { key: 'medium', label: 'Intermediate', desc: 'Applied knowledge' },
    { key: 'hard', label: 'Advanced', desc: 'Expert-level scenarios' },
    { key: 'mixed', label: 'Mixed', desc: 'Balanced difficulty' },
  ];

  const counts = [10, 25, 50, 100];
  const modes = [
    { key: 'practice', icon: BookOpen, label: 'Practice Mode', desc: 'Instant feedback after each question' },
    { key: 'exam', icon: Clock, label: 'Exam Mode', desc: 'Timed, no feedback until submission' },
  ];

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {cert?.name || 'Configure Your'} Practice Test
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Customize your test settings before starting.</p>
        </div>

        <div className="space-y-6">
          {/* Certification Selector (if not pre-selected) */}
          {!cert && (
            <div className="card p-6">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Certification</h3>
              <select value={certId} onChange={e => { setCertId(e.target.value); const c = certs.find(c => c.id === e.target.value); if (c) setCert(c); }} className="input-field">
                <option value="">Choose a certification...</option>
                {certs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Difficulty */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Difficulty</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {difficulties.map(d => (
                <button key={d.key} onClick={() => setDifficulty(d.key)} className="p-4 rounded-xl text-center transition-all" style={{
                  background: difficulty === d.key ? 'rgba(30, 64, 175, 0.1)' : 'var(--bg-tertiary)',
                  border: `2px solid ${difficulty === d.key ? '#1e40af' : 'transparent'}`,
                }}>
                  <div className="font-semibold text-sm mb-0.5" style={{ color: difficulty === d.key ? '#1e40af' : 'var(--text-primary)' }}>{d.label}</div>
                  <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Number of Questions</h3>
            <div className="flex gap-3 flex-wrap">
              {counts.map(n => (
                <button key={n} onClick={() => setQuestionCount(n)} className="px-6 py-3 rounded-xl font-semibold text-sm transition-all" style={{
                  background: questionCount === n ? 'rgba(30, 64, 175, 0.1)' : 'var(--bg-tertiary)',
                  border: `2px solid ${questionCount === n ? '#1e40af' : 'transparent'}`,
                  color: questionCount === n ? '#1e40af' : 'var(--text-primary)',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Test Mode</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {modes.map(m => (
                <button key={m.key} onClick={() => setMode(m.key)} className="p-5 rounded-xl text-left flex items-start gap-4 transition-all" style={{
                  background: mode === m.key ? 'rgba(30, 64, 175, 0.1)' : 'var(--bg-tertiary)',
                  border: `2px solid ${mode === m.key ? '#1e40af' : 'transparent'}`,
                }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: mode === m.key ? '#1e40af' : 'var(--border-color)' }}>
                    <m.icon size={18} style={{ color: mode === m.key ? 'white' : 'var(--text-secondary)' }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: mode === m.key ? '#1e40af' : 'var(--text-primary)' }}>{m.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          {cert?.topics && cert.topics.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Select Topics</h3>
                <button onClick={selectAllTopics} className="text-xs font-semibold" style={{ color: '#1e40af' }}>Select All</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {cert.topics.map(topic => {
                  const isSelected = allTopicsSelected || selectedTopics.includes(topic.id);
                  return (
                    <button key={topic.id} onClick={() => toggleTopic(topic.id)} className="flex items-center gap-3 p-3 rounded-xl text-left transition-all" style={{
                      background: isSelected ? 'rgba(30, 64, 175, 0.08)' : 'var(--bg-tertiary)',
                      border: `1px solid ${isSelected ? 'rgba(30, 64, 175, 0.3)' : 'var(--border-color)'}`,
                    }}>
                      <CheckSquare size={16} style={{ color: isSelected ? '#1e40af' : 'var(--text-tertiary)' }} />
                      <span className="text-sm font-medium" style={{ color: isSelected ? '#1e40af' : 'var(--text-primary)' }}>{topic.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Start Button */}
          <button onClick={handleStart} className="btn-primary w-full !py-4 !text-base">
            <Zap size={18} /> Start Test — {questionCount} Questions • {difficulty === 'mixed' ? 'Mixed' : difficulties.find(d => d.key === difficulty)?.label} • {mode === 'exam' ? 'Exam' : 'Practice'}
          </button>
        </div>
      </div>
    </div>
  );
}
