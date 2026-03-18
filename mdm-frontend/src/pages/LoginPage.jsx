import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username is required.'); return; }
    if (!password.trim()) { setError('Password is required.'); return; }
    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'}}>

      {/* Animated background circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10"
          style={{background: '#4f46e5', top: '-100px', right: '-100px', filter: 'blur(80px)'}}/>
        <div className="absolute w-96 h-96 rounded-full opacity-10"
          style={{background: '#7c3aed', bottom: '-100px', left: '-100px', filter: 'blur(80px)'}}/>
        <div className="absolute w-64 h-64 rounded-full opacity-5"
          style={{background: '#06b6d4', top: '50%', left: '50%', filter: 'blur(60px)'}}/>
      </div>

      <div className="relative w-full max-w-md mx-4 z-10">

        {/* Glass Card */}
        <div className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>

          {/* Header */}
          <div className="px-10 pt-10 pb-8 text-center"
            style={{borderBottom: '1px solid rgba(255,255,255,0.08)'}}>
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 8px 32px rgba(79,70,229,0.4)'
              }}>
              <span className="text-white text-3xl font-black">P</span>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Prime Engineering Lanka
            </h1>
            <p className="text-sm mt-2" style={{color: 'rgba(255,255,255,0.5)'}}>
              Master Data Management System
            </p>
          </div>

          {/* Form */}
          <div className="px-10 py-8">
            <h2 className="text-white text-lg font-semibold mb-6">
              Welcome back 👋
            </h2>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#fca5a5'
                }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{color: 'rgba(255,255,255,0.7)'}}>
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4" style={{color:'rgba(255,255,255,0.3)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => e.target.style.border='1px solid rgba(79,70,229,0.8)'}
                    onBlur={e => e.target.style.border='1px solid rgba(255,255,255,0.1)'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2"
                  style={{color: 'rgba(255,255,255,0.7)'}}>
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4" style={{color:'rgba(255,255,255,0.3)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={e => e.target.style.border='1px solid rgba(79,70,229,0.8)'}
                    onBlur={e => e.target.style.border='1px solid rgba(255,255,255,0.1)'}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center"
                    style={{color: 'rgba(255,255,255,0.3)'}}>
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 mt-2"
                style={{
                  background: loading
                    ? 'rgba(79,70,229,0.4)'
                    : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(79,70,229,0.4)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-xs mt-8"
              style={{color: 'rgba(255,255,255,0.25)'}}>
              © 2024 Prime Engineering Lanka
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;