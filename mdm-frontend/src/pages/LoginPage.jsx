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
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>

      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-150px', right: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: '#4f46e5', opacity: 0.07,
        filter: 'blur(100px)', pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: '#7c3aed', opacity: 0.07,
        filter: 'blur(100px)', pointerEvents: 'none'
      }}/>
      <div style={{
        position: 'absolute', top: '40%', left: '40%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: '#06b6d4', opacity: 0.04,
        filter: 'blur(80px)', pointerEvents: 'none'
      }}/>

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: '440px',
        margin: '20px 16px',
        borderRadius: '24px', overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
      }}>

        {/* Header */}
        <div style={{
          padding: '44px 40px 36px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{
            width: '76px', height: '76px', borderRadius: '22px',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 20px',
            boxShadow: '0 8px 32px rgba(79,70,229,0.45)'
          }}>
            <svg style={{width: '38px', height: '38px', color: '#fff'}}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
            </svg>
          </div>
          <h1 style={{
            color: '#fff', fontSize: '22px', fontWeight: '700',
            margin: '0 0 8px', letterSpacing: '-0.3px', lineHeight: 1.3
          }}>
            Master Data Management System
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '13px', margin: 0
          }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <div style={{padding: '36px 40px 44px'}}>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '12px', padding: '12px 16px',
              marginBottom: '22px', color: '#fca5a5', fontSize: '13px'
            }}>
              <svg style={{width: '16px', height: '16px', flexShrink: 0}}
                fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Username */}
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: '600',
                marginBottom: '8px', color: 'rgba(255,255,255,0.7)'
              }}>
                Username
              </label>
              <div style={{position: 'relative'}}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none'
                }}>
                  <svg style={{width: '16px', height: '16px',
                    color: 'rgba(255,255,255,0.3)'}}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  style={{
                    width: '100%', paddingLeft: '44px',
                    paddingRight: '16px', paddingTop: '13px',
                    paddingBottom: '13px', borderRadius: '12px',
                    fontSize: '14px', color: '#fff',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e =>
                    e.target.style.border = '1px solid rgba(79,70,229,0.9)'}
                  onBlur={e =>
                    e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{marginBottom: '30px'}}>
              <label style={{
                display: 'block', fontSize: '13px', fontWeight: '600',
                marginBottom: '8px', color: 'rgba(255,255,255,0.7)'
              }}>
                Password
              </label>
              <div style={{position: 'relative'}}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none'
                }}>
                  <svg style={{width: '16px', height: '16px',
                    color: 'rgba(255,255,255,0.3)'}}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: '100%', paddingLeft: '44px',
                    paddingRight: '48px', paddingTop: '13px',
                    paddingBottom: '13px', borderRadius: '12px',
                    fontSize: '14px', color: '#fff',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e =>
                    e.target.style.border = '1px solid rgba(79,70,229,0.9)'}
                  onBlur={e =>
                    e.target.style.border = '1px solid rgba(255,255,255,0.12)'}
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer', padding: '0',
                    display: 'flex', alignItems: 'center'
                  }}>
                  {showPassword ? (
                    <svg style={{width: '16px', height: '16px'}}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg style={{width: '16px', height: '16px'}}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px 24px',
                borderRadius: '12px', fontSize: '15px',
                fontWeight: '600', color: '#fff',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(79,70,229,0.4)'
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: loading
                  ? 'none' : '0 8px 24px rgba(79,70,229,0.45)',
                transition: 'all 0.2s', letterSpacing: '0.3px'
              }}>
              {loading ? (
                <span style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px'
                }}>
                  <svg style={{
                    width: '16px', height: '16px',
                    animation: 'spin 1s linear infinite'
                  }} viewBox="0 0 24 24" fill="none">
                    <circle style={{opacity: 0.25}} cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path style={{opacity: 0.75}} fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p style={{
            textAlign: 'center', marginTop: '28px',
            fontSize: '12px', color: 'rgba(255,255,255,0.2)'
          }}>
            © 2026 Master Data Management System
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px rgba(79,70,229,0.15) inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;