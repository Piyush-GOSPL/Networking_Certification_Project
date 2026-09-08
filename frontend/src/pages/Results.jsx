import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, RotateCcw, BookOpen, ArrowRight, CheckCircle2, XCircle, MinusCircle, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { testAPI } from '../services/api';

function CircularScore({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f97316' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-extrabold" style={{ color }}>{animatedScore}%</div>
        <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Score</div>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { attemptId, results: initialResults } = location.state || {};
  const [results, setResults] = useState(initialResults || null);
  const [fullResults, setFullResults] = useState(null);
  const [loading, setLoading] = useState(!initialResults);

  useEffect(() => {
    if (attemptId) {
      testAPI.getResults(attemptId).then(res => {
        setFullResults(res.data);
        if (!results) {
          const a = res.data.attempt;
          setResults({
            score: a.score,
            correct: a.correctAnswers,
            incorrect: a.incorrectAnswers,
            skipped: a.skippedAnswers,
            total: a.totalQuestions,
            timeTaken: a.timeTaken,
            passed: a.score >= 70,
            certificationName: a.certification?.name,
          });
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [attemptId]);

  if (loading || !results) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
    </div>
  );

  const topicData = fullResults?.topicPerformance ? Object.entries(fullResults.topicPerformance).map(([name, data]) => ({
    name: name.length > 15 ? name.substring(0, 15) + '...' : name,
    score: Math.round((data.correct / data.total) * 100),
    fullName: name,
  })).sort((a, b) => b.score - a.score) : [];

  const mins = Math.floor(results.timeTaken / 60);
  const secs = results.timeTaken % 60;

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Score Card */}
        <div className="card p-8 sm:p-10 text-center mb-8">
          {results.passed ? (
            <div className="mb-6">
              <div className="text-5xl mb-3">🎉</div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#22c55e' }}>Congratulations!</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>You passed the {results.certificationName} Practice Test</p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="text-5xl mb-3">📚</div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#f97316' }}>Keep Practicing!</h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Review your answers and try again</p>
            </div>
          )}

          <CircularScore score={results.score} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { icon: CheckCircle2, label: 'Correct', value: results.correct, color: '#22c55e' },
              { icon: XCircle, label: 'Incorrect', value: results.incorrect, color: '#ef4444' },
              { icon: MinusCircle, label: 'Skipped', value: results.skipped, color: '#f97316' },
              { icon: Clock, label: 'Time', value: `${mins}m ${secs}s`, color: '#1e40af' },
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <stat.icon size={20} className="mx-auto mb-2" style={{ color: stat.color }} />
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Performance */}
        {topicData.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Performance by Topic</h3>
            <div style={{ height: Math.max(200, topicData.length * 40) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }} formatter={(value) => [`${value}%`, 'Score']} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {topicData.map((entry, i) => (
                      <Cell key={i} fill={entry.score >= 80 ? '#22c55e' : entry.score >= 60 ? '#f97316' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate('/review', { state: { attemptId } })} className="btn-primary">
            <BookOpen size={16} /> Review Answers
          </button>
          <button onClick={() => navigate(-2)} className="btn-secondary">
            <RotateCcw size={16} /> Retake Test
          </button>
          <button onClick={() => navigate('/certifications')} className="btn-secondary">
            Try Another Test <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
