import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, BookOpen, BarChart3, Users, Award, Zap, Router, Globe, Lock, Terminal, Cloud, Cpu, Flame, RadioTower, CheckCircle2 } from 'lucide-react';
import { certAPI } from '../services/api';

const iconMap = { router: Router, server: Cpu, network: Globe, shield: Shield, 'shield-check': Shield, cpu: Cpu, 'radio-tower': RadioTower, flame: Flame, globe: Globe, lock: Lock, terminal: Terminal, cloud: Cloud };

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function NetworkVisualization() {
  return (
    <div className="relative w-full max-w-lg mx-auto" style={{ height: '340px' }}>
      <svg viewBox="0 0 500 340" className="w-full h-full">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e40af" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Connection lines */}
        {[[250,80,120,170],[250,80,380,170],[120,170,80,270],[120,170,180,270],[380,170,320,270],[380,170,420,270],[250,80,250,170],[250,170,250,270]].map(([x1,y1,x2,y2],i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="8" to="0" dur={`${1.5+i*0.2}s`} repeatCount="indefinite" />
            </line>
            {/* Animated packet */}
            <circle r="3" fill="#22d3ee" filter="url(#glow)">
              <animateMotion dur={`${2+i*0.3}s`} repeatCount="indefinite" begin={`${i*0.3}s`}>
                <mpath href={`#path${i}`} />
              </animateMotion>
            </circle>
            <path id={`path${i}`} d={`M${x1},${y1} L${x2},${y2}`} fill="none" />
          </g>
        ))}
        {/* Nodes */}
        {[
          {x:250,y:80,label:'Firewall',icon:'🛡️',size:28},
          {x:120,y:170,label:'Router 1',icon:'📡',size:24},
          {x:380,y:170,label:'Router 2',icon:'📡',size:24},
          {x:250,y:170,label:'Core',icon:'⚡',size:22},
          {x:80,y:270,label:'PC',icon:'💻',size:20},
          {x:180,y:270,label:'Server',icon:'🖥️',size:20},
          {x:250,y:270,label:'Switch',icon:'🔀',size:20},
          {x:320,y:270,label:'AP',icon:'📶',size:20},
          {x:420,y:270,label:'Cloud',icon:'☁️',size:20},
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy={node.y} r={node.size} fill="rgba(30, 64, 175, 0.15)" stroke="#1e40af" strokeWidth="1.5">
              <animate attributeName="r" values={`${node.size};${node.size+2};${node.size}`} dur="3s" begin={`${i*0.2}s`} repeatCount="indefinite" />
            </circle>
            <text x={node.x} y={node.y+5} textAnchor="middle" fontSize="16">{node.icon}</text>
            <text x={node.x} y={node.y+node.size+14} textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="500">{node.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Home() {
  const [certifications, setCertifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    certAPI.getAll().then(res => setCertifications(res.data.slice(0, 8))).catch(() => {});
  }, []);

  const stats = [
    { icon: BookOpen, value: 10000, suffix: '+', label: 'Practice Questions' },
    { icon: Award, value: 25, suffix: '+', label: 'Certification Tracks' },
    { icon: Users, value: 50000, suffix: '+', label: 'Tests Completed' },
    { icon: BarChart3, value: 98, suffix: '%', label: 'User Satisfaction' },
  ];

  const features = [
    { icon: Zap, title: 'Realistic Exam Experience', desc: 'Timed exams with randomized questions that simulate real certification tests.' },
    { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track your performance by topic, identify weak areas, and see progress over time.' },
    { icon: Shield, title: 'Topology-Based Questions', desc: 'Practice with network diagrams, CLI outputs, and scenario-based questions.' },
    { icon: Award, title: 'Achievements & Leaderboard', desc: 'Earn badges, compete with peers, and stay motivated on your certification journey.' },
  ];

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #1e40af, transparent)' }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
          <div className="absolute top-40 right-20 w-48 h-48 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(30, 64, 175, 0.1)', color: '#1e40af', border: '1px solid rgba(30, 64, 175, 0.2)' }}>
                <Zap size={14} /> Free Practice Tests Available
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
                Master Networking.{' '}
                <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Pass Your Certification.
                </span>
              </h1>
              <p className="text-lg mb-8 max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Practice smarter with realistic networking questions, topology-based scenarios, and detailed performance analytics for CCNA, CCNP, Network+, Security+ and more.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/certifications" className="btn-primary !py-3.5 !px-8 !text-base no-underline">
                  Start a Free Test <ArrowRight size={18} />
                </Link>
                <Link to="/certifications" className="btn-secondary !py-3.5 !px-8 !text-base no-underline">
                  Explore Certifications
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-10">
                {['Cisco', 'CompTIA', 'Fortinet', 'Juniper'].map(vendor => (
                  <span key={vendor} className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>{vendor}</span>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <NetworkVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(30, 64, 175, 0.1)' }}>
                  <stat.icon size={24} style={{ color: '#1e40af' }} />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Choose Your Certification</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Practice what matters. Build confidence. Track your progress.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map(cert => {
              const Icon = iconMap[cert.icon] || Globe;
              return (
                <div key={cert.id} className="card p-6 cursor-pointer" onClick={() => navigate(`/cert/${cert.slug}`)}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${cert.color}15` }}>
                    <Icon size={22} style={{ color: cert.color }} />
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>{cert.name}</h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>{cert.vendor}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`badge ${cert.level === 'beginner' ? 'badge-easy' : cert.level === 'intermediate' ? 'badge-medium' : 'badge-hard'}`}>
                      {cert.level}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{cert.questionCount || cert.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#1e40af' }}>
                      Start Test <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/certifications" className="btn-secondary no-underline">
              View All Certifications <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Why NetworkPrep?</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Everything you need to prepare for networking certifications, all in one platform.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card p-8 flex gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(30, 64, 175, 0.1)' }}>
                  <feature.icon size={24} style={{ color: '#1e40af' }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-12 sm:p-16" style={{ background: 'var(--gradient-primary)', border: 'none' }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Ready to Start Practicing?</h2>
            <p className="text-lg mb-8 text-white/80 max-w-lg mx-auto">Join thousands of networking professionals who are preparing smarter with NetworkPrep.</p>
            <Link to="/certifications" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:opacity-90 no-underline" style={{ background: 'white', color: '#1e40af' }}>
              Start Free Test <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
