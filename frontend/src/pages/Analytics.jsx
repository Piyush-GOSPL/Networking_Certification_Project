import { useState, useEffect } from 'react';
import { Target, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getAnalytics().then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1e40af', borderTopColor: 'transparent' }} />
    </div>
  );

  const stats = [
    { label: 'Overall Accuracy', value: `${data?.accuracy || 0}%`, icon: Target, color: '#22c55e' },
    { label: 'Avg Time/Question', value: `${data?.avgTimePerQuestion || 0}s`, icon: Clock, color: '#1e40af' },
    { label: 'Total Answered', value: data?.totalQuestionsAnswered || 0, icon: CheckCircle2, color: '#a855f7' },
    { label: 'Highest Score', value: `${data?.bestScore || 0}%`, icon: TrendingUp, color: '#f97316' },
  ];

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Performance Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Deep dive into your testing performance.</p>
        </div>

        {data?.totalTests === 0 ? (
          <div className="card p-12 text-center">
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No Data Available</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Complete your first practice test to unlock analytics.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                    <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Topic Mastery */}
              <div className="card p-6">
                <h3 className="font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Topic Mastery</h3>
                <div style={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.topicPerformance || []} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)' }} />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {(data?.topicPerformance || []).map((entry, i) => (
                          <Cell key={i} fill={entry.score >= 80 ? '#22c55e' : entry.score >= 60 ? '#f97316' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-8">
                {/* Insights */}
                {data?.recommendation && (
                  <div className="card p-6" style={{ background: 'rgba(30, 64, 175, 0.05)', border: '1px solid rgba(30, 64, 175, 0.2)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={18} style={{ color: '#1e40af' }} />
                      <h3 className="font-bold text-sm" style={{ color: '#1e40af' }}>Smart Insight</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{data.recommendation}</p>
                  </div>
                )}

                {/* Certification Progress */}
                <div className="card p-6">
                  <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Certification Progress</h3>
                  <div className="space-y-4">
                    {data?.certStats?.map((cert, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{cert.name}</span>
                          <span className="font-bold" style={{ color: '#1e40af' }}>Avg: {cert.avgScore}%</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
                          <span>Tests taken: {cert.tests}</span>
                          <span>Best: {cert.bestScore}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="h-full rounded-full" style={{ width: `${cert.avgScore}%`, background: cert.avgScore >= 70 ? '#22c55e' : '#f97316' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
