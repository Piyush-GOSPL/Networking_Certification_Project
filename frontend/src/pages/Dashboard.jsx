import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, BookOpen, Target, Clock, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dashboardAPI.getStats().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
    </div>
  );

  const stats = [
    { label: 'Tests Taken', value: data?.totalTests || 0, icon: BookOpen, color: '#1e40af' },
    { label: 'Average Score', value: `${data?.avgScore || 0}%`, icon: Target, color: '#22c55e' },
    { label: 'Best Score', value: `${data?.bestScore || 0}%`, icon: Award, color: '#a855f7' },
    { label: 'Questions Ans', value: data?.totalQuestions || 0, icon: TrendingUp, color: '#f97316' },
  ];

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {user?.fullName?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Track your progress and continue your preparation.</p>
          </div>
          <button onClick={() => navigate('/certifications')} className="btn-primary !py-2.5">
            Start New Test <ArrowRight size={16} />
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score History Chart */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Score History</h3>
                <button onClick={() => navigate('/analytics')} className="text-sm font-medium hover:underline" style={{ color: '#1e40af' }}>View Full Analytics</button>
              </div>
              {data?.scoreHistory && data.scoreHistory.length > 0 ? (
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis dataKey="cert" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="score" stroke="#1e40af" strokeWidth={3} fillOpacity={1} fill="url(#scoreColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Complete tests to see your progress chart
                </div>
              )}
            </div>

            {/* Recent Tests */}
            <div className="card p-6">
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Tests</h3>
              {data?.recentTests && data.recentTests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th className="pb-3 font-medium">Certification</th>
                        <th className="pb-3 font-medium">Score</th>
                        <th className="pb-3 font-medium">Questions</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                      {data.recentTests.map((t, i) => (
                        <tr key={i} className="hover:bg-opacity-5 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                          <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{t.certification?.name}</td>
                          <td className="py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${t.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {t.score}%
                            </span>
                          </td>
                          <td className="py-3">{t.totalQuestions}</td>
                          <td className="py-3">{new Date(t.completedAt).toLocaleDateString()}</td>
                          <td className="py-3 text-right">
                            <button onClick={() => navigate('/results', { state: { attemptId: t.id } })} className="text-sm font-semibold hover:underline" style={{ color: '#1e40af' }}>
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No tests completed yet.</div>
              )}
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-8">
            {/* Weak Topics */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} style={{ color: '#f97316' }} />
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Areas for Improvement</h3>
              </div>
              {data?.weakTopics && data.weakTopics.length > 0 ? (
                <div className="space-y-4">
                  {data.weakTopics.map((t, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium truncate pr-2" style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                        <span style={{ color: '#ef4444' }}>{t.score}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${t.score}%`, background: '#ef4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Take more tests to identify weak areas.</p>
              )}
            </div>

            {/* Achievements preview */}
            <div className="card p-6">
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Achievements</h3>
              {data?.achievements && data.achievements.length > 0 ? (
                <div className="space-y-3">
                  {data.achievements.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="text-2xl">{a.achievement.icon}</div>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{a.achievement.name}</div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 px-4 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                  <Award size={32} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--text-primary)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Complete tests and score high to earn achievements!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
