import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Sending OTP to:', email);
      await apiService.sendOtp(email);
      
      setStep('otp');
      setMessage('OTP sent successfully! Check your email.');
    } catch (error) {
      console.error('OTP send error:', error);
      setMessage(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage('Please enter the OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Verifying OTP for:', email);
      const response = await apiService.verifyOtp(email, otp);
      
      console.log('OTP verification response:', response);
      await login({ email, otp });
      setMessage('Login successful!');
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setMessage('');
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card-header">
          <h2 className="card-title">Login to Citizen Project</h2>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                required
              />
              <small>OTP sent to: {email}</small>
            </div>
            <button 
              type="submit" 
              className="btn" 
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleBackToEmail}
              style={{ marginLeft: '10px' }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login; 