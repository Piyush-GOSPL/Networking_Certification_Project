import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Search } from 'lucide-react';
import { dashboardAPI } from '../services/api';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dashboardAPI.getLeaderboard().then(res => {
      setLeaders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = leaders.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-transition min-h-screen pt-24 pb-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Global Leaderboard</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Top performers across all networking certifications.</p>
        </div>

        <div className="card p-6 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-11" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <div className="skeleton w-8 h-8 rounded-lg" />
                <div className="skeleton w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/4" />
                </div>
                <div className="skeleton h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((user, i) => {
              const rank = user.rank || i + 1;
              const isTop3 = rank <= 3;
              const medals = ['text-yellow-400', 'text-gray-400', 'text-amber-600'];
              
              return (
                <div key={user.id} className="card p-4 flex items-center gap-4 transition-all hover:scale-[1.01]" style={{ 
                  background: rank === 1 ? 'rgba(250, 204, 21, 0.05)' : 'var(--bg-card)',
                  border: rank === 1 ? '1px solid rgba(250, 204, 21, 0.3)' : '1px solid var(--border-color)'
                }}>
                  <div className="w-8 font-bold text-center" style={{ color: isTop3 ? 'inherit' : 'var(--text-tertiary)' }}>
                    {isTop3 ? <Medal size={24} className={`mx-auto ${medals[rank - 1]}`} /> : `#${rank}`}
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0" style={{ background: 'var(--gradient-primary)' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</h3>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1"><Award size={14} /> {user.testsCompleted} tests</span>
                      <span className="hidden sm:flex items-center gap-1"><TrendingUp size={14} /> Best: {user.bestScore}%</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: '#1e40af' }}>{user.avgScore}%</div>
                    <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Avg Score</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 card">
            <p style={{ color: 'var(--text-secondary)' }}>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
