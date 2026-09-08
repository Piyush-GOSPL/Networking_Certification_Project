import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flag, Trash2, Clock, AlertTriangle, CheckCircle2, XCircle, Send, BookOpen, Eye, EyeOff } from 'lucide-react';
import { testAPI } from '../services/api';
import toast from 'react-hot-toast';

function Timer({ timeLimit, onTimeUp, onWarning }) {
  const [remaining, setRemaining] = useState(timeLimit);
  const warned = useRef({});

  useEffect(() => {
    if (timeLimit <= 0) return;
    const interval = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (next <= 0) { clearInterval(interval); onTimeUp(); return 0; }
        if (next === 600 && !warned.current[600]) { warned.current[600] = true; onWarning('10 minutes remaining!'); }
        if (next === 300 && !warned.current[300]) { warned.current[300] = true; onWarning('5 minutes remaining!'); }
        if (next === 60 && !warned.current[60]) { warned.current[60] = true; onWarning('1 minute remaining!'); }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isLow = remaining <= 300;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${isLow ? 'animate-pulse' : ''}`} style={{
      background: isLow ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-tertiary)',
      color: isLow ? '#ef4444' : 'var(--text-primary)',
    }}>
      <Clock size={16} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}

export default function TestInterface() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state;

  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [certName, setCertName] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState(new Set());
  const [feedback, setFeedback] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [showNav, setShowNav] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [suspiciousEvents, setSuspiciousEvents] = useState([]);
  const questionStartTime = useRef(Date.now());

  // Anti-cheating: detect tab visibility changes
  useEffect(() => {
    if (config?.mode !== 'exam') return;
    const handleVisibility = () => {
      if (document.hidden) {
        const event = { type: 'tab_hidden', timestamp: new Date().toISOString() };
        setSuspiciousEvents(prev => [...prev, event]);
        toast.error('⚠️ Warning: Leaving the exam window is recorded!', { duration: 3000 });
        if (attemptId) testAPI.logSuspicious(attemptId, event).catch(() => {});
      }
    };
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave? Your test progress may be lost.';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [config?.mode, attemptId]);

  // Generate test on mount
  useEffect(() => {
    if (!config) { navigate('/certifications'); return; }
    testAPI.generate({
      certificationId: config.certificationId,
      difficulty: config.difficulty,
      questionCount: config.questionCount,
      mode: config.mode,
      selectedTopics: config.selectedTopics,
    }).then(res => {
      setAttemptId(res.data.attempt.id);
      setQuestions(res.data.questions);
      setCertName(res.data.certification?.name || config.certificationName || 'Practice Test');
      setTimeLimit(res.data.timeLimit || 0);
      setLoading(false);
    }).catch(err => {
      toast.error(err.response?.data?.error || 'Failed to generate test');
      navigate('/certifications');
    });
  }, []);

  const currentQuestion = questions[currentIndex];
  const isMultiSelect = currentQuestion?.type === 'multiple_select';

  const selectAnswer = (optionLetter) => {
    if (feedback[currentQuestion.id] && config.mode === 'practice' && showFeedback[currentQuestion.id]) return;
    if (isMultiSelect) {
      setAnswers(prev => {
        const curr = prev[currentQuestion.id] || [];
        const next = curr.includes(optionLetter) ? curr.filter(o => o !== optionLetter) : [...curr, optionLetter];
        return { ...prev, [currentQuestion.id]: next };
      });
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionLetter }));
    }
  };

  const saveAnswer = useCallback(async (qId, answer, isMarkedFlag) => {
    if (!attemptId || answer === undefined) return;
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    try {
      const res = await testAPI.submitAnswer(attemptId, { questionId: qId, userAnswer: answer, isMarked: isMarkedFlag, timeTaken });
      if (config.mode === 'practice' && res.data.correctAnswer !== undefined) {
        setFeedback(prev => ({ ...prev, [qId]: res.data }));
      }
    } catch { /* silently fail */ }
  }, [attemptId, config?.mode]);

  const goToQuestion = (index) => {
    // Save current answer before navigating
    const currentQ = questions[currentIndex];
    if (currentQ && answers[currentQ.id] !== undefined) {
      saveAnswer(currentQ.id, answers[currentQ.id], marked.has(currentQ.id));
    }
    setCurrentIndex(index);
    setShowNav(false);
    questionStartTime.current = Date.now();
  };

  const toggleMark = () => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  };

  const clearAnswer = () => {
    setAnswers(prev => { const next = { ...prev }; delete next[currentQuestion.id]; return next; });
    setFeedback(prev => { const next = { ...prev }; delete next[currentQuestion.id]; return next; });
    setShowFeedback(prev => { const next = { ...prev }; delete next[currentQuestion.id]; return next; });
  };

  const checkAnswer = () => {
    if (answers[currentQuestion.id] !== undefined) {
      saveAnswer(currentQuestion.id, answers[currentQuestion.id], marked.has(currentQuestion.id));
      setShowFeedback(prev => ({ ...prev, [currentQuestion.id]: true }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Save current answer
    if (currentQuestion && answers[currentQuestion.id] !== undefined) {
      await saveAnswer(currentQuestion.id, answers[currentQuestion.id], marked.has(currentQuestion.id));
    }
    try {
      const res = await testAPI.submitTest(attemptId, { suspiciousEvents });
      navigate('/results', { state: { attemptId, results: res.data }, replace: true });
    } catch (err) {
      toast.error('Failed to submit test');
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    toast.error('Time is up! Submitting your test...');
    handleSubmit();
  };

  const unanswered = questions.filter(q => answers[q.id] === undefined).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Generating your test...</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Randomizing questions and options</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-50 px-4 py-3" style={{ background: 'var(--bg-glass)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{certName}</h2>
            <span className="badge badge-medium shrink-0">Q {currentIndex + 1}/{questions.length}</span>
          </div>
          <div className="flex items-center gap-3">
            {timeLimit > 0 && <Timer timeLimit={timeLimit} onTimeUp={handleTimeUp} onWarning={(msg) => toast.error(msg, { icon: '⏰' })} />}
            <button onClick={() => setShowNav(!showNav)} className="px-3 py-2 rounded-xl text-xs font-semibold sm:hidden" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
              Nav
            </button>
            <button onClick={() => unanswered > 0 ? setShowConfirm(true) : handleSubmit()} disabled={submitting} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#1e40af' }}>
              <Send size={14} className="inline mr-1.5" /> Submit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {currentQuestion && (
              <div className="card p-6 sm:p-8">
                {/* Question Header */}
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className={`badge ${currentQuestion.difficulty === 'easy' ? 'badge-easy' : currentQuestion.difficulty === 'medium' ? 'badge-medium' : 'badge-hard'}`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                    {currentQuestion.type?.replace(/_/g, ' ')}
                  </span>
                  {marked.has(currentQuestion.id) && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
                      <Flag size={11} className="inline mr-1" /> Marked
                    </span>
                  )}
                </div>

                {/* Code Block */}
                {currentQuestion.codeBlock && (
                  <pre className="p-4 rounded-xl text-sm mb-6 overflow-x-auto font-mono leading-relaxed" style={{ background: '#0f172a', color: '#e2e8f0', border: '1px solid #1e293b' }}>
                    {currentQuestion.codeBlock}
                  </pre>
                )}

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-semibold mb-6 leading-relaxed" style={{ color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                  {currentQuestion.questionText}
                </h3>

                {/* Topology Visualization */}
                {currentQuestion.topologyData && (
                  <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                      {currentQuestion.topologyData.nodes?.map((node, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="px-3 py-2 rounded-lg text-xs font-bold" style={{ background: 'rgba(30, 64, 175, 0.15)', color: '#1e40af', border: '1px solid rgba(30, 64, 175, 0.3)' }}>
                            {node}
                          </div>
                          {i < currentQuestion.topologyData.nodes.length - 1 && (
                            <span style={{ color: 'var(--text-tertiary)' }}>→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const selected = isMultiSelect
                      ? (answers[currentQuestion.id] || []).includes(letter)
                      : answers[currentQuestion.id] === letter;
                    const fb = feedback[currentQuestion.id];
                    const showingFb = showFeedback[currentQuestion.id];
                    const isCorrectOption = showingFb && fb && (Array.isArray(fb.correctAnswer) ? fb.correctAnswer.includes(letter) : fb.correctAnswer === letter);
                    const isWrongSelected = showingFb && fb && selected && !isCorrectOption;

                    return (
                      <button key={i} onClick={() => selectAnswer(letter)} className="w-full text-left p-4 rounded-xl flex items-start gap-4 transition-all" style={{
                        background: isCorrectOption ? 'rgba(34, 197, 94, 0.1)' : isWrongSelected ? 'rgba(239, 68, 68, 0.1)' : selected ? 'rgba(30, 64, 175, 0.1)' : 'var(--bg-tertiary)',
                        border: `2px solid ${isCorrectOption ? '#22c55e' : isWrongSelected ? '#ef4444' : selected ? '#1e40af' : 'transparent'}`,
                      }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold" style={{
                          background: isCorrectOption ? '#22c55e' : isWrongSelected ? '#ef4444' : selected ? '#1e40af' : 'var(--border-color)',
                          color: (selected || isCorrectOption || isWrongSelected) ? 'white' : 'var(--text-secondary)',
                        }}>
                          {isCorrectOption ? <CheckCircle2 size={16} /> : isWrongSelected ? <XCircle size={16} /> : letter}
                        </div>
                        <span className="text-sm pt-1.5 font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                          {option}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Practice Mode Feedback */}
                {config.mode === 'practice' && showFeedback[currentQuestion.id] && feedback[currentQuestion.id] && (
                  <div className="mt-6 p-5 rounded-xl" style={{
                    background: feedback[currentQuestion.id].isCorrect ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${feedback[currentQuestion.id].isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      {feedback[currentQuestion.id].isCorrect
                        ? <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                        : <XCircle size={18} style={{ color: '#ef4444' }} />}
                      <span className="font-bold text-sm" style={{ color: feedback[currentQuestion.id].isCorrect ? '#22c55e' : '#ef4444' }}>
                        {feedback[currentQuestion.id].isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                    {feedback[currentQuestion.id].explanation && (
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {feedback[currentQuestion.id].explanation}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
                  <div className="flex gap-2">
                    <button onClick={toggleMark} className="btn-secondary !py-2.5 !px-4 !text-xs">
                      <Flag size={14} className={marked.has(currentQuestion.id) ? 'text-orange-500' : ''} />
                      {marked.has(currentQuestion.id) ? 'Unmark' : 'Mark'}
                    </button>
                    <button onClick={clearAnswer} className="btn-secondary !py-2.5 !px-4 !text-xs">
                      <Trash2 size={14} /> Clear
                    </button>
                    {config.mode === 'practice' && !showFeedback[currentQuestion.id] && answers[currentQuestion.id] !== undefined && (
                      <button onClick={checkAnswer} className="btn-secondary !py-2.5 !px-4 !text-xs" style={{ color: '#22c55e', borderColor: '#22c55e33' }}>
                        <Eye size={14} /> Check Answer
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => goToQuestion(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="btn-secondary !py-2.5 !px-4 !text-xs" style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}>
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <button onClick={() => goToQuestion(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1} className="btn-primary !py-2.5 !px-4 !text-xs">
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Question Navigator - Desktop */}
          <div className="hidden sm:block w-64 shrink-0">
            <div className="card p-4 sticky top-24">
              <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Question Navigator</h4>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((q, i) => {
                  const answered = answers[q.id] !== undefined;
                  const isMarked = marked.has(q.id);
                  const isCurrent = i === currentIndex;
                  return (
                    <button key={i} onClick={() => goToQuestion(i)} className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all" style={{
                      background: isCurrent ? '#1e40af' : answered ? 'rgba(34, 197, 94, 0.15)' : isMarked ? 'rgba(249, 115, 22, 0.15)' : 'var(--bg-tertiary)',
                      color: isCurrent ? 'white' : answered ? '#22c55e' : isMarked ? '#f97316' : 'var(--text-tertiary)',
                      border: `1px solid ${isCurrent ? '#1e40af' : answered ? 'rgba(34, 197, 94, 0.3)' : isMarked ? 'rgba(249, 115, 22, 0.3)' : 'var(--border-color)'}`,
                    }}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded" style={{ background: 'rgba(34, 197, 94, 0.3)' }} /> Answered ({questions.filter(q => answers[q.id] !== undefined).length})</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded" style={{ background: 'rgba(249, 115, 22, 0.3)' }} /> Marked ({marked.size})</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }} /> Not answered ({unanswered})</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigator */}
      {showNav && (
        <div className="fixed inset-0 z-50 sm:hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto" style={{ background: 'var(--bg-card)' }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Questions</h4>
              <button onClick={() => setShowNav(false)} className="text-sm" style={{ color: 'var(--text-secondary)' }}>Close</button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {questions.map((q, i) => {
                const answered = answers[q.id] !== undefined;
                const isMarked = marked.has(q.id);
                return (
                  <button key={i} onClick={() => goToQuestion(i)} className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold" style={{
                    background: answered ? 'rgba(34, 197, 94, 0.15)' : isMarked ? 'rgba(249, 115, 22, 0.15)' : 'var(--bg-tertiary)',
                    color: answered ? '#22c55e' : isMarked ? '#f97316' : 'var(--text-tertiary)',
                  }}>
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="card p-8 max-w-md w-full text-center" style={{ animation: 'pageIn 0.2s ease-out' }}>
            <AlertTriangle size={48} className="mx-auto mb-4" style={{ color: '#f97316' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Submit Test?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              You still have <strong>{unanswered} unanswered question{unanswered !== 1 ? 's' : ''}</strong>. Are you sure you want to submit?
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary">Review Answers</button>
              <button onClick={() => { setShowConfirm(false); handleSubmit(); }} className="btn-primary">Submit Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
