import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Filter } from 'lucide-react';
import { testAPI } from '../services/api';

export default function AnswerReview() {
  const navigate = useNavigate();
  const location = useLocation();
  const { attemptId } = location.state || {};
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) { navigate('/dashboard'); return; }
    testAPI.getResults(attemptId).then(res => { setData(res.data); setLoading(false); }).catch(() => { navigate('/dashboard'); });
  }, [attemptId]);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
    </div>
  );

  const answers = data?.attempt?.answers || [];
  const filtered = answers.filter(a => {
    if (filter === 'correct') return a.isCorrect;
    if (filter === 'incorrect') return !a.isCorrect && a.userAnswer !== null;
    if (filter === 'skipped') return a.userAnswer === null;
    return true;
  });

  const filters = [
    { key: 'all', label: `All (${answers.length})` },
    { key: 'correct', label: `Correct (${answers.filter(a => a.isCorrect).length})` },
    { key: 'incorrect', label: `Incorrect (${answers.filter(a => !a.isCorrect && a.userAnswer !== null).length})` },
    { key: 'skipped', label: `Skipped (${answers.filter(a => a.userAnswer === null).length})` },
  ];

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Results
        </button>

        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Answer Review</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{data?.attempt?.certification?.name}</p>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} className="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all" style={{
              background: filter === f.key ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
              color: filter === f.key ? 'white' : 'var(--text-secondary)',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((answer, i) => {
            const q = answer.question;
            if (!q) return null;
            const isSkipped = answer.userAnswer === null;
            const Icon = isSkipped ? MinusCircle : answer.isCorrect ? CheckCircle2 : XCircle;
            const color = isSkipped ? '#f97316' : answer.isCorrect ? '#22c55e' : '#ef4444';
            const status = isSkipped ? 'Skipped' : answer.isCorrect ? 'Correct' : 'Incorrect';

            return (
              <div key={answer.id} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${color}15` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${color}15`, color }}>{status}</span>
                      <span className={`badge ${q.difficulty === 'easy' ? 'badge-easy' : q.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'}`}>{q.difficulty}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{q.topic?.name}</span>
                    </div>
                    <p className="text-sm font-medium mb-4 leading-relaxed" style={{ color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{q.questionText}</p>

                    {q.codeBlock && (
                      <pre className="p-3 rounded-xl text-xs mb-4 overflow-x-auto font-mono" style={{ background: '#0f172a', color: '#e2e8f0' }}>{q.codeBlock}</pre>
                    )}

                    <div className="space-y-2 mb-4">
                      {q.options?.map((opt, j) => {
                        const letter = String.fromCharCode(65 + j);
                        const isUserAnswer = Array.isArray(answer.userAnswer) ? answer.userAnswer.includes(letter) : answer.userAnswer === letter;
                        const isCorrectOpt = Array.isArray(q.correctAnswer) ? q.correctAnswer.includes(letter) : q.correctAnswer === letter;
                        return (
                          <div key={j} className="flex items-start gap-3 p-2.5 rounded-lg text-sm" style={{
                            background: isCorrectOpt ? 'rgba(34, 197, 94, 0.08)' : isUserAnswer && !isCorrectOpt ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                            border: `1px solid ${isCorrectOpt ? 'rgba(34, 197, 94, 0.2)' : isUserAnswer && !isCorrectOpt ? 'rgba(239, 68, 68, 0.2)' : 'transparent'}`,
                          }}>
                            <span className="font-bold text-xs w-5" style={{ color: isCorrectOpt ? '#22c55e' : isUserAnswer ? '#ef4444' : 'var(--text-tertiary)' }}>{letter}.</span>
                            <span style={{ color: 'var(--text-primary)' }}>{opt}</span>
                            {isCorrectOpt && <CheckCircle2 size={14} className="ml-auto shrink-0" style={{ color: '#22c55e' }} />}
                            {isUserAnswer && !isCorrectOpt && <XCircle size={14} className="ml-auto shrink-0" style={{ color: '#ef4444' }} />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                        <p className="text-xs font-semibold mb-1.5" style={{ color: '#1e40af' }}>Explanation</p>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Filter size={40} className="mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No questions match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
