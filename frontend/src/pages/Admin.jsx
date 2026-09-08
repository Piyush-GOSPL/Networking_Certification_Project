import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Users, FileText, Target, ShieldCheck } from 'lucide-react';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#a855f7', borderTopColor: 'transparent' }} />
    </div>
  );

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#3b82f6' },
    { label: 'Total Questions', value: stats?.totalQuestions || 0, icon: FileText, color: '#10b981' },
    { label: 'Certifications', value: stats?.totalCertifications || 0, icon: ShieldCheck, color: '#f59e0b' },
    { label: 'Tests Taken', value: stats?.totalTests || 0, icon: Target, color: '#8b5cf6' },
  ];

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <ShieldCheck size={28} style={{ color: '#a855f7' }} /> Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Platform overview and management.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {cards.map((card, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15` }}>
                  <card.icon size={20} style={{ color: card.color }} />
                </div>
                <div className="text-xs sm:text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{card.label}</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Users</h3>
            <div className="space-y-3">
              {stats?.recentUsers?.map(user => (
                <div key={user.id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user.fullName}</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user.mobile}</div>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Tests</h3>
            <div className="space-y-3">
              {stats?.recentTests?.map(test => (
                <div key={test.id} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{test.user?.fullName}</div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{test.certification?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm" style={{ color: test.score >= 70 ? '#10b981' : '#ef4444' }}>{test.score}%</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(test.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
