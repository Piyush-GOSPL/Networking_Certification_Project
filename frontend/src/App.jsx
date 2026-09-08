import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import Certifications from './pages/Certifications';
import CertDetail from './pages/CertDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestConfig from './pages/TestConfig';
import TestInterface from './pages/TestInterface';
import Results from './pages/Results';
import AnswerReview from './pages/AnswerReview';
// Placeholder for Analytics and Leaderboard
import Analytics from './pages/Analytics';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/cert/:slug" element={<CertDetail />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/test-config" element={<ProtectedRoute><TestConfig /></ProtectedRoute>} />
                <Route path="/test/active" element={<ProtectedRoute><TestInterface /></ProtectedRoute>} />
                <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
                <Route path="/review" element={<ProtectedRoute><AnswerReview /></ProtectedRoute>} />

                {/* Admin Route */}
                <Route path="/admin/*" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'toast-custom',
              duration: 4000,
            }} 
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
