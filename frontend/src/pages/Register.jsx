import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { User, Phone, Mail, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: '', mobile: '', email: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const certState = location.state;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^[0-9]{10}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!agreed) e.agreed = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      toast.success('Registration successful!');
      if (certState?.certId) {
        navigate('/test-config', { state: { certificationId: certState.certId } });
      } else {
        navigate('/certifications');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="page-transition min-h-screen pt-24 pb-16 flex items-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--gradient-primary)' }}>
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Create Your Account</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quick registration to start your practice tests.</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-tertiary)' }} />
                <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Enter your full name" className="input-field !pl-11" />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-tertiary)' }} />
                <input type="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile number" className="input-field !pl-11" />
              </div>
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-tertiary)' }} />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="input-field !pl-11" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 rounded accent-[#1e40af]" />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I agree to the <a href="#" className="font-medium" style={{ color: '#1e40af' }}>Terms & Privacy Policy</a>
              </span>
            </label>
            {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? 'Creating Account...' : 'Continue to Test'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" className="font-semibold no-underline" style={{ color: '#1e40af' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
